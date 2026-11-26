import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { OrderProvider } from '../../state/OrderContext.jsx'
import { isStepValid } from '../../state/validation.js'
import { useOrder } from '../../state/useOrder.js'
import { PaymentStep } from './PaymentStep.jsx'

function PaymentWithNext() {
  const { order } = useOrder()
  const [attempted, setAttempted] = useState(false)

  return (
    <>
      <PaymentStep attempted={attempted} />
      <button
        type="button"
        onClick={() => {
          if (!isStepValid(order, 6)) setAttempted(true)
        }}
      >
        Next step
      </button>
    </>
  )
}

describe('PaymentStep', () => {
  it('shows card number and expiration errors only after Next, then clears them', async () => {
    const user = userEvent.setup()
    render(
      <OrderProvider>
        <PaymentWithNext />
      </OrderProvider>,
    )

    const card = screen.getByRole('textbox', { name: 'Card number' })
    const expiration = screen.getByRole('textbox', { name: 'Expiration date' })
    await user.type(card, '4')
    await user.type(expiration, '1')

    expect(screen.queryByText('Enter a valid card number')).not.toBeInTheDocument()
    expect(screen.queryByText('Enter a date in the format MM/YY')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next step' }))
    expect(screen.getByText('Enter a valid card number')).toBeInTheDocument()
    expect(screen.getByText('Enter a date in the format MM/YY')).toBeInTheDocument()

    fireEvent.change(card, { target: { value: '4242424242424242' } })
    fireEvent.change(expiration, { target: { value: '1230' } })
    expect(screen.queryByText('Enter a valid card number')).not.toBeInTheDocument()
    expect(screen.queryByText('Enter a date in the format MM/YY')).not.toBeInTheDocument()
  })
})

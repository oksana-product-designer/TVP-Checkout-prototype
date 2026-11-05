import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { OrderProvider } from '../../state/OrderContext.jsx'
import { DeliveryStep } from './DeliveryStep.jsx'

describe('DeliveryStep', () => {
  it('sets State when Washington, DC is chosen', async () => {
    const user = userEvent.setup()
    render(
      <OrderProvider>
        <DeliveryStep />
      </OrderProvider>,
    )

    await user.type(screen.getByRole('combobox', { name: 'City' }), 'Washington')
    await user.click(screen.getByRole('option', { name: 'Washington, DC' }))

    expect(screen.getByRole('combobox', { name: 'State' })).toHaveValue('District of Columbia')
  })
})

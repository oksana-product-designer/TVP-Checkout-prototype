import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App.jsx'
import { createTraveler, initialOrder } from './state/initialOrder.js'
import { OrderContext } from './state/orderContext.js'
import { OrderProvider } from './state/OrderContext.jsx'

function validTravelerOrder() {
  return {
    ...initialOrder,
    travelers: [
      {
        ...createTraveler('t1'),
        firstName: 'Ada',
        lastName: 'Lovelace',
        stateOfResidence: 'CA',
        email: 'ada@example.com',
        phone: '(555) 010-01-99',
        passportServiceIds: ['renewal'],
        visaServiceIds: ['afghanistan'],
      },
    ],
  }
}

function OrderHarness({ order, children }) {
  const [value, setOrder] = useState(order)
  return (
    <OrderContext.Provider value={{ order: value, setOrder }}>
      {children}
    </OrderContext.Provider>
  )
}

describe('step gating', () => {
  it('blocks Next until the required fields are valid', async () => {
    const user = userEvent.setup()
    const view = render(
      <OrderProvider>
        <App />
      </OrderProvider>,
    )

    const next = screen.getByRole('button', { name: 'Next step' })
    expect(next).toHaveAttribute('aria-disabled', 'true')
    await user.click(next)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Kick off your order')
    expect(screen.getByText('Enter your first name')).toBeInTheDocument()

    view.unmount()
    render(
      <OrderHarness order={validTravelerOrder()}>
        <App />
      </OrderHarness>,
    )
    expect(screen.getByRole('button', { name: 'Next step' })).not.toHaveAttribute('aria-disabled')
  })
})

import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { OrderProvider } from '../../state/OrderContext.jsx'
import { DeliveryStep } from './DeliveryStep.jsx'

describe('DeliveryStep', () => {
  afterEach(cleanup)

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

  it('disables the address but keeps the note when both shipping methods are On my own', async () => {
    const user = userEvent.setup()
    render(
      <OrderProvider>
        <DeliveryStep />
      </OrderProvider>,
    )

    expect(screen.getByRole('textbox', { name: 'Street address' })).toBeEnabled()

    await user.click(screen.getByRole('combobox', { name: /Inbound Shipping/ }))
    await user.click(screen.getByRole('option', { name: 'On my own' }))
    await user.click(screen.getByRole('combobox', { name: /Return Shipping/ }))
    await user.click(screen.getByRole('option', { name: 'On my own' }))

    expect(screen.getByRole('textbox', { name: 'Street address' })).toBeDisabled()
    expect(screen.getByRole('combobox', { name: 'City' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Add a note to the order' }))
    expect(screen.getByRole('textbox', { name: 'Note to the order' })).toBeEnabled()
  })
})

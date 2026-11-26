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

    await user.click(screen.getByRole('combobox', { name: 'How will you send your documents?' }))
    await user.click(screen.getByRole('option', { name: 'Fedex 2nd Day Shipping ($24)' }))
    await user.type(screen.getByRole('combobox', { name: 'City' }), 'Washington')
    await user.click(screen.getByRole('option', { name: 'Washington, DC' }))

    expect(screen.getByRole('combobox', { name: 'State' })).toHaveValue('District of Columbia')
  })

  it('hides the address until FedEx, an own carrier, or an authorized location is chosen', async () => {
    const user = userEvent.setup()
    render(
      <OrderProvider>
        <DeliveryStep />
      </OrderProvider>,
    )

    expect(screen.queryByRole('heading', { name: 'Delivery address' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('combobox', { name: 'How will you send your documents?' }))
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Fedex 2nd Day Shipping ($24)',
      'FedEx Priority (morning) Overnight ($49)',
      'I will ship on my own',
      'Personal Delivery To TVP VIP Office',
      'Personal Delivery To TVP Authorized Location',
    ])
    await user.click(screen.getByRole('option', { name: 'Personal Delivery To TVP VIP Office' }))
    await user.click(screen.getByRole('combobox', { name: 'How should we return them?' }))
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'FedEx 2nd Day Shipping ($24)',
      'FedEx Priority (morning) Overnight ($49)',
      'FedEx Saturday Priority Overnight ($79)',
      'Personal Pickup From TVP VIP Office',
      'Personal Pickup From TVP Authorized Location',
      'I will provide a pre-paid, pre-addressed return label',
    ])
    await user.click(screen.getByRole('option', { name: 'Personal Pickup From TVP VIP Office' }))

    expect(screen.queryByRole('heading', { name: 'Delivery address' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('combobox', { name: 'How should we return them?' }))
    await user.keyboard('{ArrowDown}')
    await user.click(screen.getByRole('option', { name: 'I will provide a pre-paid, pre-addressed return label' }))

    expect(screen.getByRole('textbox', { name: 'Street address' })).toBeEnabled()
    await user.click(screen.getByRole('button', { name: 'Add a note to the order' }))
    expect(screen.getByRole('textbox', { name: 'Note to the order' })).toBeEnabled()
  })

  it('hides the address when shipping on your own is paired with a pickup', async () => {
    const user = userEvent.setup()
    render(
      <OrderProvider>
        <DeliveryStep />
      </OrderProvider>,
    )

    await user.click(screen.getByRole('combobox', { name: 'How will you send your documents?' }))
    await user.click(screen.getByRole('option', { name: 'I will ship on my own' }))
    expect(screen.getByRole('heading', { name: 'Delivery address' })).toBeInTheDocument()

    await user.click(screen.getByRole('combobox', { name: 'How should we return them?' }))
    await user.click(screen.getByRole('option', { name: 'Personal Pickup From TVP VIP Office' }))
    expect(screen.queryByRole('heading', { name: 'Delivery address' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('combobox', { name: 'How should we return them?' }))
    await user.keyboard('{ArrowDown}')
    await user.click(screen.getByRole('option', { name: 'Personal Pickup From TVP Authorized Location' }))
    expect(screen.queryByRole('heading', { name: 'Delivery address' })).not.toBeInTheDocument()
  })
})

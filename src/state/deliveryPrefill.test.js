import { describe, expect, it } from 'vitest'
import { prefillDelivery } from './deliveryPrefill.js'
import { initialOrder } from './initialOrder.js'

function baseOrder() {
  const order = structuredClone(initialOrder)
  Object.assign(order.travelers[0], { firstName: 'Jane', lastName: 'Doe', phone: '(222) 222 22 22', stateOfResidence: 'NY' })
  return order
}

describe('prefillDelivery', () => {
  it('fills name, phone and state from the first Applicant', () => {
    const { address } = prefillDelivery(baseOrder()).delivery
    expect(address).toMatchObject({ fullName: 'Jane Doe', phone: '(222) 222 22 22', state: 'NY', company: '', zip: '' })
  })

  it('fills every delivery field from a validated corporate account', () => {
    const order = baseOrder()
    order.corporate = { hasAccount: true, accountNumber: '123456789', status: 'valid' }
    const { address } = prefillDelivery(order).delivery
    expect(address).toMatchObject({
      fullName: 'Alex Morgan',
      phone: '(415) 555 01 23',
      company: 'Acme Corporate Travel',
      street: '100 Market Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
    })
  })

  it('does not overwrite the user edits afterwards', () => {
    const order = baseOrder()
    order.corporate = { hasAccount: true, accountNumber: '123456789', status: 'valid' }
    const filled = prefillDelivery(order)
    const edited = { ...filled, delivery: { ...filled.delivery, address: { ...filled.delivery.address, street: 'My own street' } } }
    expect(prefillDelivery(edited)).toBe(edited)
  })

  it('ignores accounts that are not validated or switched off', () => {
    const order = baseOrder()
    order.corporate = { hasAccount: true, accountNumber: '123456789', status: 'idle' }
    expect(prefillDelivery(order).delivery.address.company).toBe('')
  })
})

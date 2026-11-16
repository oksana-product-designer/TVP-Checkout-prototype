import { describe, expect, it } from 'vitest'
import { initialOrder } from './initialOrder.js'
import { getSummaryTree } from './summary.js'
import { getOrderTotal } from './totals.js'

function orderWith(corporate) {
  const order = structuredClone(initialOrder)
  order.delivery.inboundShippingId = 'fedex-2nd-day'
  order.delivery.returnShippingId = 'fedex-overnight'
  order.corporate = { ...order.corporate, ...corporate }
  return order
}

describe('corporate account discount', () => {
  it('takes 20% off the whole order at once when the account is validated', () => {
    const order = orderWith({ hasAccount: true, accountNumber: '123456789', status: 'valid' })

    expect(getOrderTotal(order)).toBeCloseTo(58.4)
    const row = getSummaryTree(order).find((item) => item.id === 'corporate-discount')
    expect(row).toMatchObject({ label: 'Corporate account (20% off)', price: '-$14.60' })
  })

  it('gives no discount before validation or when the account is switched off', () => {
    const idle = orderWith({ hasAccount: true, accountNumber: '123456789', status: 'idle' })
    const off = orderWith({ hasAccount: false, accountNumber: '123456789', status: 'valid' })

    expect(getOrderTotal(idle)).toBe(73)
    expect(getOrderTotal(off)).toBe(73)
    expect(getSummaryTree(idle).some((item) => item.id === 'corporate-discount')).toBe(false)
  })
})

describe('promo discount row', () => {
  it('follows the corporate discount row in the summary', () => {
    const order = orderWith({ hasAccount: true, accountNumber: '123456789', status: 'valid' })
    order.promo = { code: 'test0', appliedCode: 'test0' }

    const ids = getSummaryTree(order).map((item) => item.id)
    expect(ids.slice(-2)).toEqual(['corporate-discount', 'promo-discount'])
    expect(getSummaryTree(order).at(-1).label).toBe('Promo test0 (10% off)')
  })
})


describe('VIP package pricing', () => {
  function withPackage(id, applicants) {
    const order = structuredClone(initialOrder)
    order.travelers = Array.from({ length: applicants }, (_, i) => ({ ...order.travelers[0], id: `t${i + 1}` }))
    order.vipPackageId = id
    return getSummaryTree(order).find((item) => item.id === `vip-${id}`)
  }

  it('charges VIP Concierge once per Applicant', () => {
    expect(withPackage('concierge', 1)).toMatchObject({ label: 'VIP Concierge', price: '$770.00' })
    expect(withPackage('concierge', 3)).toMatchObject({ label: 'VIP Concierge (3 Applicants)', price: '$2,310.00' })
  })

  it('charges Executive Club once per order', () => {
    expect(withPackage('executive', 3)).toMatchObject({ label: 'Executive Club', price: '$499.00' })
  })
})

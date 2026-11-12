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

    expect(getOrderTotal(order)).toBeCloseTo(47.2)
    const row = getSummaryTree(order).find((item) => item.id === 'corporate-discount')
    expect(row).toMatchObject({ label: 'Corporate account (20% off)', price: '-$11.80' })
  })

  it('gives no discount before validation or when the account is switched off', () => {
    const idle = orderWith({ hasAccount: true, accountNumber: '123456789', status: 'idle' })
    const off = orderWith({ hasAccount: false, accountNumber: '123456789', status: 'valid' })

    expect(getOrderTotal(idle)).toBe(59)
    expect(getOrderTotal(off)).toBe(59)
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


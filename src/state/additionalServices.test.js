import { describe, expect, it } from 'vitest'
import { initialOrder } from './initialOrder.js'
import { getSummaryTree } from './summary.js'
import { additionalServiceList, isAdditionalServiceChecked } from './additionalServices.js'

describe('additional services', () => {
  it('starts checked and stays out of the order summary', () => {
    expect(additionalServiceList.every((service) => isAdditionalServiceChecked(initialOrder, service.id))).toBe(true)
    expect(getSummaryTree(initialOrder).some((row) => row.id.startsWith('additional-'))).toBe(false)
  })

  it('keeps an unchecked service off until a package is selected', () => {
    const order = structuredClone(initialOrder)
    order.additionalServices['form-fill'] = false

    expect(isAdditionalServiceChecked(order, 'form-fill')).toBe(false)

    order.vipPackageId = 'concierge'
    expect(isAdditionalServiceChecked(order, 'form-fill')).toBe(true)
    expect(getSummaryTree(order).some((row) => row.id.startsWith('additional-'))).toBe(false)
  })
})

import { formatDiscount, formatMoney, getCorporateDiscount, getCorporateDiscountPercent, getPackageLine, getPromoDiscount, findPromo, getShippingLines, getTravelerLines } from './totals.js'

export function getSummaryTree(order) {
  const rows = order.travelers.map((traveler, index) => {
    const lines = getTravelerLines(traveler, order)
    const amount = lines.reduce((sum, line) => sum + line.amount, 0)
    const first = traveler.firstName.trim()
    const last = traveler.lastName.trim()
    const name = first && last ? `${first} ${last}` : ''
    const number = index + 1

    return {
      id: traveler.id,
      kind: 'applicant',
      label: name ? `Applicant ${number}: ${name}` : `Applicant ${number}`,
      price: formatMoney(amount),
      children: lines.map((line) => ({
        id: `${traveler.id}-${line.id}`,
        label: line.label,
        price: formatMoney(line.amount),
        children: (line.children || []).map((child) => ({
          id: `${traveler.id}-${child.id}`,
          label: child.label,
          price: formatMoney(child.amount),
        })),
      })),
    }
  })

  const vip = getPackageLine(order)
  if (vip) {
    rows.push({
      id: vip.id,
      kind: 'order',
      label: vip.label,
      price: formatMoney(vip.amount),
      children: [],
    })
  }

  getShippingLines(order).forEach((line) => {
    rows.push({
      id: line.id,
      kind: 'order',
      label: line.label,
      price: formatMoney(line.amount),
      children: [],
    })
  })

  const corporateDiscount = getCorporateDiscount(order)
  if (corporateDiscount > 0) {
    rows.push({
      id: 'corporate-discount',
      kind: 'discount',
      label: `Corporate account (${getCorporateDiscountPercent(order)}% off)`,
      price: formatDiscount(corporateDiscount),
      children: [],
    })
  }

  const promo = order.promo.appliedCode ? findPromo(order.promo.appliedCode) : null
  if (promo) {
    rows.push({
      id: 'promo-discount',
      kind: 'discount',
      label: promo.label,
      price: formatDiscount(getPromoDiscount(order)),
      children: [],
    })
  }

  return rows
}

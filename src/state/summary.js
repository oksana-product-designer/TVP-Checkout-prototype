import { formatMoney, getPackageLine, getTravelerLines } from './totals.js'

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
      label: name ? `Traveller ${number}: ${name}` : `Traveller ${number}`,
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
      label: vip.label,
      price: formatMoney(vip.amount),
      children: [],
    })
  }

  return rows
}

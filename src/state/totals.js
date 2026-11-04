import { visaIdsOf } from './initialOrder.js'
import addons from '../mocks/addons.json'
import passportServices from '../mocks/passport-services.json'
import promoCodes from '../mocks/promo-codes.json'
import packages from '../mocks/packages.json'
import visaServices from '../mocks/visa-services.json'

const passportById = Object.fromEntries(passportServices.map((service) => [service.id, service]))
const visaById = Object.fromEntries(visaServices.map((service) => [service.id, service]))
const passportCard = addons.find((item) => item.id === 'passport-card')

function formatAmount(amount) {
  return Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function formatMoney(amount) {
  return `${amount < 0 ? '-' : ''}$${formatAmount(amount)}`
}

export function formatDiscount(amount) {
  return `-$${formatAmount(amount)}`
}

export function getTravelerLines(traveler, order) {
  const lines = []
  const passportRows = order?.servicesByTraveler?.[traveler.id]?.passport || []

  traveler.passportServiceIds.forEach((serviceId) => {
    const service = passportById[serviceId]
    if (!service) return
    const row = passportRows.find((item) => item.serviceId === serviceId)
    const cardPrice = row?.passportCard && passportCard ? passportCard.price : 0

    if (cardPrice) {
      lines.push({
        id: service.id,
        label: service.label,
        amount: service.price + cardPrice,
        children: [
          { id: `${service.id}-service`, label: 'Passport service', amount: service.price },
          { id: `${service.id}-card`, label: 'Passport Card', amount: cardPrice },
        ],
      })
      return
    }

    lines.push({ id: service.id, label: service.label, amount: service.price })
  })

  visaIdsOf(traveler).forEach((serviceId) => {
    const visa = visaById[serviceId]
    if (!visa) return
    lines.push({ id: `visa-${visa.id}`, label: `Visa ${visa.label}`, amount: visa.price })
  })

  return lines
}

export function getServiceSubtotal(order) {
  return order.travelers.reduce((sum, traveler) => {
    const lines = getTravelerLines(traveler, order)
    return sum + lines.reduce((lineSum, line) => lineSum + line.amount, 0)
  }, 0)
}

export function getPackageLine(order) {
  const pkg = packages.find((item) => item.id === order.vipPackageId)
  if (!pkg || pkg.price <= 0) return null
  const count = order.travelers.length
  return {
    id: `vip-${pkg.id}`,
    label: `${pkg.name} x ${count} ${count === 1 ? 'traveler' : 'travelers'}`,
    amount: pkg.price * count,
  }
}

export function getPromoDiscount(order) {
  if (!order.promo.appliedCode) return 0
  const promo = promoCodes.find((item) => item.code === order.promo.appliedCode)
  if (!promo || promo.type !== 'percent') return 0
  return getServiceSubtotal(order) * (promo.value / 100)
}

export function getOrderTotal(order) {
  return getServiceSubtotal(order) - getPromoDiscount(order) + (getPackageLine(order)?.amount || 0)
}

export function findPromo(code) {
  const normalized = String(code || '').trim().toLowerCase()
  return promoCodes.find((item) => item.code.toLowerCase() === normalized) || null
}

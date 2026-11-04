import { visaIdsOf } from './initialOrder.js'
import addons from '../mocks/addons.json'
import passportServices from '../mocks/passport-services.json'
import promoCodes from '../mocks/promo-codes.json'
import visaServices from '../mocks/visa-services.json'

const passportById = Object.fromEntries(passportServices.map((service) => [service.id, service]))
const visaById = Object.fromEntries(visaServices.map((service) => [service.id, service]))
const passportCard = addons.find((item) => item.id === 'passport-card')

export function formatMoney(amount) {
  const negative = amount < 0
  return `${negative ? '-' : ''}$${Math.abs(amount).toFixed(2)}`
}

export function formatDiscount(amount) {
  return `-$${Math.abs(amount).toFixed(2)}`
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

export function getPromoDiscount(order) {
  if (!order.promo.appliedCode) return 0
  const promo = promoCodes.find((item) => item.code === order.promo.appliedCode)
  if (!promo || promo.type !== 'percent') return 0
  return getServiceSubtotal(order) * (promo.value / 100)
}

export function getOrderTotal(order) {
  return getServiceSubtotal(order) - getPromoDiscount(order)
}

export function findPromo(code) {
  const normalized = String(code || '').trim().toLowerCase()
  return promoCodes.find((item) => item.code.toLowerCase() === normalized) || null
}

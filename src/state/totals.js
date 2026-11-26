import { visaIdsOf } from './initialOrder.js'
import { deliveryRequired } from './validation.js'
import addons from '../mocks/addons.json'
import corporateAccounts from '../mocks/corporate-accounts.json'
import passportServices from '../mocks/passport-services.json'
import promoCodes from '../mocks/promo-codes.json'
import packages from '../mocks/packages.json'
import shippingMethods from '../mocks/shipping-methods.json'
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
  if (!pkg) return null
  // Per-applicant packages (VIP Concierge) are charged once for every Applicant.
  const count = pkg.perApplicant ? Math.max(1, order.travelers.length) : 1
  return {
    id: `vip-${pkg.id}`,
    label: count > 1 ? `${pkg.name} (${count} Applicants)` : pkg.name,
    amount: pkg.price * count,
  }
}

export function getPromoDiscount(order) {
  if (!order.promo.appliedCode) return 0
  const promo = promoCodes.find((item) => item.code === order.promo.appliedCode)
  if (!promo || promo.type !== 'percent') return 0
  return getServiceSubtotal(order) * (promo.value / 100)
}

function shippingAmount(method, vipPackageId) {
  if (vipPackageId === 'concierge' && method.id === 'fedex-2nd-day') return 0
  if (vipPackageId === 'executive' && method.id === 'fedex-overnight') return 0
  return method.price
}

export function getShippingLines(order) {
  if (!deliveryRequired(order)) return []
  const delivery = order.delivery || {}
  const choices = [
    ['inboundShippingId', 'Ship to us'],
    ['returnShippingId', 'Ship back to you'],
  ]

  return choices.flatMap(([field, title]) => {
    const methods = field === 'inboundShippingId' ? shippingMethods.inbound : shippingMethods.return
    const method = methods.find((item) => item.id === delivery[field])
    if (!method) return []
    return [{
      id: `shipping-${field}`,
      label: `${title} (${method.label})`,
      amount: shippingAmount(method, order.vipPackageId),
    }]
  })
}

function getOrderSubtotal(order) {
  const shipping = getShippingLines(order).reduce((sum, line) => sum + line.amount, 0)
  return getServiceSubtotal(order) + (getPackageLine(order)?.amount || 0) + shipping
}

export function getValidCorporateAccount(order) {
  if (!order.corporate?.hasAccount || order.corporate.status !== 'valid') return null
  const account = corporateAccounts.find((item) => item.accountNumber === order.corporate.accountNumber)
  return account?.valid ? account : null
}

export function getCorporateDiscountPercent(order) {
  return getValidCorporateAccount(order)?.discountPercent || 0
}

// Applies to the whole order: services, VIP package and shipping, before the promo code.
export function getCorporateDiscount(order) {
  return getOrderSubtotal(order) * (getCorporateDiscountPercent(order) / 100)
}

export function getOrderTotal(order) {
  return getOrderSubtotal(order) - getPromoDiscount(order) - getCorporateDiscount(order)
}

export function findPromo(code) {
  const normalized = String(code || '').trim().toLowerCase()
  return promoCodes.find((item) => item.code.toLowerCase() === normalized) || null
}

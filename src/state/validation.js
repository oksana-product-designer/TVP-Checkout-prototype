import packages from '../mocks/packages.json'
import shippingMethods from '../mocks/shipping-methods.json'
import states from '../mocks/states.json'
import visaServices from '../mocks/visa-services.json'
import { selectionsOf, visaIdsOf } from './initialOrder.js'

const visaById = Object.fromEntries(visaServices.map((service) => [service.id, service]))

const EMAIL = /^[^\s@]+@[^\s@]+$/
const PHONE = /^\(\d{3}\) \d{3} \d{2} \d{2}$/

const MESSAGES = {
  firstName: 'Enter your first name',
  lastName: 'Enter your last name',
  nationality: 'Select your nationality',
  stateOfResidence: 'Select your state of residence',
  email: 'Enter an email in the format name@domain',
  phone: 'Enter a phone number in the format (000) 000 00 00',
}

const ZIP = /^\d{5}$/
const LATIN_WORD = /^[A-Za-z]+$/

export function validateFullName(value) {
  const text = String(value || '').trim()
  if (!text) return 'Enter your full name'
  const words = text.split(/\s+/)
  if (words.length < 2 || words.some((word) => !LATIN_WORD.test(word))) {
    return 'Enter a first and last name using letters only'
  }
  return null
}

export function formatZip(value) {
  return String(value || '').replace(/\D/g, '').slice(0, 5)
}

export function formatPhone(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 10)
  const area = digits.slice(0, 3)
  const prefix = digits.slice(3, 6)
  const left = digits.slice(6, 8)
  const right = digits.slice(8, 10)

  if (!digits) return ''
  if (digits.length <= 3) return `(${area}`
  if (digits.length <= 6) return `(${area}) ${prefix}`
  if (digits.length <= 8) return `(${area}) ${prefix} ${left}`
  return `(${area}) ${prefix} ${left} ${right}`
}

const TRAVELER_FIELDS = Object.keys(MESSAGES)

export function formatDisplayDate(date) {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}/${date.getFullYear()}`
}

export function parseDisplayDate(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(value || '').trim())
  if (!match) return null

  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null
  }
  return date
}

function startOfToday() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

function isUsableDate(value) {
  const date = parseDisplayDate(value)
  return Boolean(date) && date >= startOfToday()
}

export function validatePassportBackDate(value) {
  return isUsableDate(value) ? null : 'Select the date you need your documents back'
}

export function validateTravelDate(value) {
  const text = String(value || '').trim()
  if (!text) return null
  return isUsableDate(text) ? null : 'Enter a valid travel date'
}

export function serviceRows(order, traveler) {
  const stored = order.servicesByTraveler?.[traveler.id] || {}
  const passportStored = Array.isArray(stored.passport) ? stored.passport : []
  const visaStored = Array.isArray(stored.visa) ? stored.visa : []

  return {
    passport: (traveler.passportServiceIds || []).map((serviceId) => (
      passportStored.find((item) => item.serviceId === serviceId) || {
        serviceId,
        pages: '',
        processingSpeed: '',
        passportCard: false,
      }
    )),
    visa: visaIdsOf(traveler).map((serviceId) => (
      visaStored.find((item) => item.serviceId === serviceId) || {
        serviceId,
        visaType: '',
        processingSpeed: '',
        entries: '',
        validityPeriod: '',
      }
    )),
  }
}

export function passportFieldError(row, field) {
  if (field === 'pages') return row?.pages ? null : 'Select number of pages'
  if (field === 'processingSpeed') return row?.processingSpeed ? null : 'Select processing speed'
  return null
}

export function visaFieldError(row, field) {
  if (field === 'visaType') return row?.visaType ? null : 'Select a visa type'
  if (field === 'processingSpeed') return row?.processingSpeed ? null : 'Select processing speed'
  if (field === 'entries') return row?.entries ? null : 'Select number of entries'
  if (field === 'validityPeriod') return row?.validityPeriod ? null : 'Select a validity period'
  return null
}

export function travelerServiceErrorCount(order, traveler) {
  const selections = selectionsOf(traveler)
  const rows = serviceRows(order, traveler)
  let count = selections.length ? 0 : 1

  selections.forEach((selection) => {
    if (!selection.serviceId) {
      count += 1
      return
    }
    const row = rows[selection.kind]?.find((item) => item.serviceId === selection.serviceId)
    if (selection.kind === 'passport') {
      if (passportFieldError(row, 'pages')) count += 1
      if (passportFieldError(row, 'processingSpeed')) count += 1
      return
    }
    if (visaFieldError(row, 'visaType')) count += 1
    if (visaFieldError(row, 'processingSpeed')) count += 1
    if (visaFieldError(row, 'entries')) count += 1
    if (visaFieldError(row, 'validityPeriod')) count += 1
  })

  return count
}

export function validateField(field, value) {
  if (field === 'firstName' || field === 'lastName') {
    return String(value || '').trim() ? null : MESSAGES[field]
  }

  if (field === 'email') {
    return EMAIL.test(String(value || '').trim()) ? null : MESSAGES.email
  }

  if (field === 'phone') {
    return PHONE.test(String(value || '')) ? null : MESSAGES.phone
  }

  if (field === 'nationality' || field === 'stateOfResidence') {
    return value ? null : MESSAGES[field]
  }

  return null
}

export const SHIPPING_ON_MY_OWN = 'on-my-own'

// The address is only needed when TVP ships at least one way.
export function addressRequired(delivery = {}) {
  return !(delivery.inboundShippingId === SHIPPING_ON_MY_OWN && delivery.returnShippingId === SHIPPING_ON_MY_OWN)
}

export function deliveryErrors(order) {
  const delivery = order.delivery || {}
  const address = delivery.address || {}
  const errors = {}

  if (!shippingMethods.some((item) => item.id === delivery.inboundShippingId)) {
    errors.inboundShippingId = 'Select an inbound shipping method'
  }
  if (!shippingMethods.some((item) => item.id === delivery.returnShippingId)) {
    errors.returnShippingId = 'Select a return shipping method'
  }
  if (!addressRequired(delivery)) return errors
  const nameMessage = validateFullName(address.fullName)
  if (nameMessage) errors.fullName = nameMessage
  const phoneMessage = validateField('phone', address.phone)
  if (phoneMessage) errors.phone = phoneMessage
  if (!String(address.street || '').trim()) errors.street = 'Enter your street address'
  if (!String(address.city || '').trim()) errors.city = 'Enter your city'
  if (!states.some((item) => item.id === address.state)) errors.state = 'Select a state'
  if (!ZIP.test(String(address.zip || '').trim())) errors.zip = 'Enter a valid ZIP code'

  return errors
}

export function isTravelerValid(traveler, { contact = true } = {}) {
  return TRAVELER_FIELDS.every((field) => {
    if (!contact && (field === 'email' || field === 'phone')) return true
    return !validateField(field, traveler[field])
  })
}

function isOnlineVisaType(type) {
  if (!type) return false
  return /online/i.test(String(type.id || '')) || /online/i.test(String(type.label || ''))
}

export function deliveryRequired(order) {
  const chosen = []
  ;(order.travelers || []).forEach((traveler) => {
    selectionsOf(traveler).forEach((selection) => {
      if (selection.serviceId) chosen.push({ traveler, selection })
    })
  })
  if (!chosen.length) return true

  return chosen.some(({ traveler, selection }) => {
    if (selection.kind !== 'visa') return true
    return !isOnlineVisaType(visaTypeOf(order, traveler, selection))
  })
}

function visaTypeOf(order, traveler, selection) {
  const visa = visaById[selection.serviceId]
  const rows = order.servicesByTraveler?.[traveler.id]?.visa || []
  const row = rows.find((item) => item.serviceId === selection.serviceId)
  return visa?.visaTypes?.find((item) => item.id === row?.visaType) || null
}

function joinServiceLabels(labels) {
  if (labels.length <= 1) return labels[0] || ''
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`
  return `${labels.slice(0, -1).join(', ')}, and ${labels[labels.length - 1]}`
}

export function deliverySkippedMessage(order) {
  const labels = []
  ;(order.travelers || []).forEach((traveler) => {
    selectionsOf(traveler).forEach((selection) => {
      if (selection.kind !== 'visa' || !selection.serviceId) return
      const type = visaTypeOf(order, traveler, selection)
      if (!isOnlineVisaType(type)) return
      const country = visaById[selection.serviceId]?.label
      const label = country ? `${type.label} (${country})` : type.label
      if (!labels.includes(label)) labels.push(label)
    })
  })
  if (!labels.length) return 'No delivery is required for the Visa service you chose.'
  const service = labels.length === 1 ? 'Visa service' : 'Visa services'
  return `No delivery is required for the ${service} ${joinServiceLabels(labels)}.`
}

export function isStepValid(order, step = 1) {
  if (step === 1) {
    if (order.corporate.hasAccount && order.corporate.status !== 'valid') return false
    if (validatePassportBackDate(order.trip?.passportBackDate)) return false
    if (validateTravelDate(order.trip?.travelDate)) return false
    return order.travelers.every((traveler, index) => isTravelerValid(traveler, { contact: index === 0 }))
  }

  if (step === 2) {
    return order.travelers.every((traveler) => travelerServiceErrorCount(order, traveler) === 0)
  }

  if (step === 3) return packages.some((item) => item.id === order.vipPackageId)

  if (step === 4) {
    if (!deliveryRequired(order)) return true
    return Object.keys(deliveryErrors(order)).length === 0
  }

  if (step === 5) return Object.keys(paymentErrors(order)).length === 0

  return false
}

const EXPIRATION = /^(0[1-9]|1[0-2])\/(\d{2})$/
const CVV = /^\d{3}$/

function passesLuhn(digits) {
  let sum = 0
  let doubleDigit = false
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index])
    if (doubleDigit) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    doubleDigit = !doubleDigit
  }
  return sum % 10 === 0
}

export function formatCardNumber(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

export function formatExpiration(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 4)
  if (digits.length < 3) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

export function formatCvv(value) {
  return String(value || '').replace(/\D/g, '').slice(0, 3)
}

function expirationError(value) {
  const match = EXPIRATION.exec(String(value || ''))
  if (!match) return 'Enter a date in the format MM/YY'
  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  const now = new Date()
  const entered = year * 12 + month
  const current = now.getFullYear() * 12 + now.getMonth() + 1
  if (entered < current) return 'Enter a valid expiration date'
  return ''
}

export function paymentErrors(order) {
  const payment = order.payment || {}
  if (payment.method !== 'card') return {}
  const errors = {}
  const digits = String(payment.cardNumber || '').replace(/\D/g, '')
  if (digits.length !== 16 || !passesLuhn(digits)) {
    errors.cardNumber = 'Enter a valid card number'
  }
  const expirationMessage = expirationError(payment.expiration)
  if (expirationMessage) errors.expiration = expirationMessage
  if (!CVV.test(String(payment.cvv || ''))) {
    errors.cvv = 'Enter a 3-digit CVV'
  }
  return errors
}

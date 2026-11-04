import { visaIdsOf } from './initialOrder.js'

const EMAIL = /^[^\s@]+@[^\s@]+$/
const PHONE = /^\(\d{3}\) \d{3}-\d{2}-\d{2}$/

const MESSAGES = {
  firstName: 'Enter your first name',
  lastName: 'Enter your last name',
  nationality: 'Select your nationality',
  stateOfResidence: 'Select your state of residence',
  email: 'Enter an email in the format name@domain',
  phone: 'Enter a phone number in the format (000) 000-00-00',
  passportServiceIds: 'Select a passport service',
  visaServiceIds: 'Select a visa service',
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
  if (digits.length <= 8) return `(${area}) ${prefix}-${left}`
  return `(${area}) ${prefix}-${left}-${right}`
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
  return isUsableDate(value) ? null : 'Select the date you need your passport back'
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
  if (field === 'entries') return row?.entries ? null : 'Select number of entries'
  if (field === 'validityPeriod') return row?.validityPeriod ? null : 'Select a validity period'
  return null
}

export function travelerServiceErrorCount(order, traveler) {
  const rows = serviceRows(order, traveler)
  let count = 0

  rows.passport.forEach((row) => {
    if (passportFieldError(row, 'pages')) count += 1
    if (passportFieldError(row, 'processingSpeed')) count += 1
  })

  rows.visa.forEach((row) => {
    if (visaFieldError(row, 'visaType')) count += 1
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

  if (field === 'passportServiceIds' || field === 'visaServiceIds') {
    return Array.isArray(value) && value.length > 0 ? null : MESSAGES[field]
  }

  if (field === 'nationality' || field === 'stateOfResidence') {
    return value ? null : MESSAGES[field]
  }

  return null
}

export function isTravelerValid(traveler) {
  return TRAVELER_FIELDS.every((field) => {
    const value = field === 'visaServiceIds' ? visaIdsOf(traveler) : traveler[field]
    return !validateField(field, value)
  })
}

export function isStepValid(order, step = 1) {
  if (step === 1) {
    if (order.corporate.hasAccount && order.corporate.status !== 'valid') return false
    return order.travelers.every(isTravelerValid)
  }

  if (step === 2) {
    if (validatePassportBackDate(order.trip?.passportBackDate)) return false
    if (validateTravelDate(order.trip?.travelDate)) return false
    return order.travelers.every((traveler) => travelerServiceErrorCount(order, traveler) === 0)
  }

  return false
}

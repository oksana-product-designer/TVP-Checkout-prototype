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
  if (step !== 1) return false
  if (order.corporate.hasAccount && order.corporate.status !== 'valid') return false
  return order.travelers.every(isTravelerValid)
}

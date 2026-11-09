export function createTraveler(id) {
  return {
    id,
    firstName: '',
    lastName: '',
    nationality: 'US',
    stateOfResidence: '',
    email: '',
    phone: '',
    smsConsent: false,
    serviceKind: 'passport',
    serviceSelections: [{ id: 's1', kind: 'passport', serviceId: '' }],
    passportServiceIds: [],
    visaServiceIds: [],
  }
}

export function selectionsOf(traveler) {
  if (Array.isArray(traveler.serviceSelections)) return traveler.serviceSelections
  const passport = (traveler.passportServiceIds || []).map((serviceId) => ({
    id: `passport-${serviceId}`,
    kind: 'passport',
    serviceId,
  }))
  const visa = visaIdsOf(traveler).map((serviceId) => ({
    id: `visa-${serviceId}`,
    kind: 'visa',
    serviceId,
  }))
  if (passport.length || visa.length) return [...passport, ...visa]
  return [{ id: 's1', kind: traveler.serviceKind || 'passport', serviceId: '' }]
}

export function nextSelectionId(selections) {
  const max = selections.reduce((highest, item) => {
    const number = Number(String(item.id).replace(/\D/g, ''))
    return Number.isFinite(number) ? Math.max(highest, number) : highest
  }, 0)
  return `s${max + 1}`
}

export function visaIdsOf(traveler) {
  if (Array.isArray(traveler.visaServiceIds)) return traveler.visaServiceIds
  return traveler.visaServiceId ? [traveler.visaServiceId] : []
}

export function emptyServices() {
  return {
    passport: [],
    visa: [],
  }
}

export const initialOrder = {
  corporate: {
    hasAccount: false,
    accountNumber: '',
    status: 'idle',
  },
  travelers: [createTraveler('t1')],
  trip: {
    passportBackDate: '',
    travelDate: '',
  },
  servicesByTraveler: {
    t1: emptyServices(),
  },
  vipPackageId: 'lite',
  delivery: {
    inboundShippingId: '',
    returnShippingId: '',
    addressPrefilled: false,
    corporatePrefilled: '',
    note: '',
    address: {
      fullName: '',
      phone: '',
      company: '',
      street: '',
      city: '',
      state: '',
      country: 'US',
      zip: '',
    },
  },
  payment: {
    method: 'card',
    cardNumber: '',
    expiration: '',
    cvv: '',
  },
  promo: {
    code: '',
    appliedCode: null,
  },
}

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
    passportServiceIds: [],
    visaServiceIds: [],
  }
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
  vipPackageId: 'free',
  delivery: {
    inboundShippingId: '',
    returnShippingId: '',
    address: {
      fullName: '',
      phone: '',
      company: '',
      street: '',
      street2: '',
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

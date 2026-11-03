export const initialOrder = {
  corporate: {
    hasAccount: false,
    accountNumber: '',
    status: 'idle',
  },
  travelers: [
    {
      id: 't1',
      firstName: '',
      lastName: '',
      nationality: 'US',
      stateOfResidence: '',
      email: '',
      phone: '',
      smsConsent: false,
      passportServiceIds: [],
      visaServiceId: '',
    },
  ],
  trip: {
    passportBackDate: '',
    travelDate: '',
  },
  servicesByTraveler: {
    t1: {
      passport: [],
      visa: {
        serviceId: '',
        visaType: '',
        entries: '',
        validityPeriod: '',
      },
    },
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

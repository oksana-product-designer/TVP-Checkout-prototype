import { describe, expect, it } from 'vitest'
import { initialOrder } from './initialOrder.js'
import { getReviewDetails } from './reviewDetails.js'

describe('review details', () => {
  it('reads the order into the review rows', () => {
    const order = structuredClone(initialOrder)
    const traveler = order.travelers[0]
    order.trip.passportBackDate = '01/12/2026'
    traveler.firstName = 'Cornelia'
    traveler.lastName = 'Kovalenko'
    traveler.stateOfResidence = 'CA'
    traveler.email = 'cornelia.kovalenko@example.com'
    traveler.phone = '(415) 555 01 99'
    traveler.serviceSelections = [
      { id: 's1', kind: 'passport', serviceId: 'renewal' },
      { id: 's2', kind: 'visa', serviceId: 'uganda' },
      { id: 's3', kind: 'legalization', serviceId: '' },
    ]
    traveler.passportServiceIds = ['renewal']
    traveler.visaServiceIds = ['uganda']
    order.servicesByTraveler.t1 = {
      passport: [{ serviceId: 'renewal', pages: '28', processingSpeed: '2-weeks', passportCard: true }],
      visa: [{
        serviceId: 'uganda',
        visaType: 'tourist',
        processingSpeed: '2-weeks',
        entries: 'single',
        validityPeriod: '3-months',
      }],
    }
    order.delivery.inboundShippingId = 'fedex-2nd-day'
    order.delivery.returnShippingId = 'fedex-2nd-day'
    order.delivery.note = 'Leave at the desk'
    order.delivery.address = {
      fullName: 'Cornelia Kovalenko',
      company: '',
      phone: '',
      street: '350 Mission Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
    }

    const details = getReviewDetails(order)

    expect(details.trip).toEqual([
      { label: 'Documents back by', value: '01/12/2026' },
      { label: 'Travel date', value: 'Not set' },
      { label: 'Corporate account', value: 'No' },
    ])
    expect(details.applicants[0]).toMatchObject({
      title: 'Applicant 1 · Cornelia Kovalenko',
      rows: [
        { label: 'Residence', value: 'United States of America, California' },
        { label: 'Contact', value: 'cornelia.kovalenko@example.com · (415) 555 01 99' },
      ],
    })
    expect(details.services[0].rows).toEqual([
      { label: 'Passport renewal', value: '2 weeks · Passport Card added' },
      { label: 'Visa Uganda', value: 'Tourist · Single entry · 3 months · 2 weeks' },
      { label: 'Legalization', value: 'Not provided' },
    ])
    expect(details.vip[0]).toEqual({ label: 'Package', value: 'No package' })
    expect(details.vip[1].value).toContain('Document pre-check')
    expect(details.delivery.skipped).toBe(false)
    expect(details.delivery.rows).toEqual([
      { label: 'Sending to us', value: 'Fedex 2nd Day Shipping ($24)' },
      { label: 'Return to you', value: 'FedEx 2nd Day Shipping ($24)' },
      {
        label: 'Address',
        value: 'Cornelia Kovalenko, 350 Mission Street, San Francisco, CA 94105, United States',
      },
      { label: 'Note', value: 'Leave at the desk' },
    ])
  })

  it('uses the skip message when delivery is not required', () => {
    const order = structuredClone(initialOrder)
    const traveler = order.travelers[0]
    traveler.serviceSelections = [{ id: 's1', kind: 'visa', serviceId: 'uganda' }]
    traveler.visaServiceIds = ['uganda']
    order.servicesByTraveler.t1.visa = [{
      serviceId: 'uganda',
      visaType: 'tourist-online',
      processingSpeed: '2-weeks',
      entries: 'single',
      validityPeriod: '3-months',
    }]

    const details = getReviewDetails(order)

    expect(details.delivery.skipped).toBe(true)
    expect(details.delivery.message).toMatch(/No shipping is needed/)
    expect(details.delivery.rows).toEqual([])
  })
})
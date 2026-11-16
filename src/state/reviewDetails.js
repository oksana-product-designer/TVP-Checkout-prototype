import nationalities from '../mocks/nationalities.json'
import packages from '../mocks/packages.json'
import passportServices from '../mocks/passport-services.json'
import processingSpeeds from '../mocks/processing-speeds.json'
import shippingMethods from '../mocks/shipping-methods.json'
import states from '../mocks/states.json'
import visaServices from '../mocks/visa-services.json'
import { SERVICE_CHOICES, selectionsInChoiceOrder } from '../steps/service/serviceChoices.js'
import { additionalServiceList, isAdditionalServiceChecked } from './additionalServices.js'
import { selectionsOf } from './initialOrder.js'
import { deliveryRequired, deliverySkippedMessage, serviceRows } from './validation.js'

const NOT_PROVIDED = 'Not provided'
const NOT_SET = 'Not set'

function text(value) {
  return String(value || '').trim()
}

function labelOf(list, id) {
  return list.find((item) => item.id === id)?.label || ''
}

function joinParts(parts) {
  const filled = parts.map(text).filter(Boolean)
  return filled.length ? filled.join(' · ') : NOT_PROVIDED
}

function applicantTitle(traveler, index) {
  const name = [traveler.firstName, traveler.lastName].map(text).filter(Boolean).join(' ')
  const title = `Applicant ${index + 1}`
  return name ? `${title} · ${name}` : title
}

function residenceValue(traveler) {
  const value = [labelOf(nationalities, traveler.nationality), labelOf(states, traveler.stateOfResidence)]
    .filter(Boolean)
    .join(', ')
  return value || NOT_PROVIDED
}

function contactValue(traveler) {
  const value = [traveler.email, traveler.phone].map(text).filter(Boolean).join(' · ')
  return value || NOT_PROVIDED
}

function entryPhrase(label) {
  if (!label || /entry/i.test(label)) return label
  if (label === 'Single') return 'Single entry'
  if (label === 'Multiple') return 'Multiple entries'
  return label
}

function passportLine(order, traveler, selection) {
  const service = passportServices.find((item) => item.id === selection.serviceId)
  const row = serviceRows(order, traveler).passport.find((item) => item.serviceId === selection.serviceId)
  const parts = [labelOf(processingSpeeds, row?.processingSpeed)]
  if (row?.passportCard) parts.push('Passport Card added')
  return {
    label: service?.label || 'Passport',
    value: joinParts(parts),
  }
}

function visaLine(order, traveler, selection) {
  const visa = visaServices.find((item) => item.id === selection.serviceId)
  const row = serviceRows(order, traveler).visa.find((item) => item.serviceId === selection.serviceId)
  const type = labelOf(visa?.visaTypes || [], row?.visaType).replace(/ visa$/i, '')
  return {
    label: visa ? `Visa ${visa.label}` : 'Visa',
    value: joinParts([
      type,
      entryPhrase(labelOf(visa?.entries || [], row?.entries)),
      labelOf(visa?.validityPeriods || [], row?.validityPeriod),
      labelOf(processingSpeeds, row?.processingSpeed),
    ]),
  }
}

function serviceLine(order, traveler, selection) {
  if (selection.kind === 'passport') return passportLine(order, traveler, selection)
  if (selection.kind === 'visa') return visaLine(order, traveler, selection)
  const choice = SERVICE_CHOICES.find((item) => item.kind === selection.kind)
  return { label: choice?.label || 'Service', value: NOT_PROVIDED }
}

function addressLine(address = {}) {
  const name = text(address.fullName)
  const company = text(address.company)
  const street = text(address.street)
  const city = text(address.city)
  const state = text(address.state)
  const zip = text(address.zip)
  const place = [city, [state, zip].filter(Boolean).join(' ')].filter(Boolean).join(', ')
  const parts = [name, company, street, place].filter(Boolean)
  if (!parts.length) return NOT_PROVIDED
  return [...parts, 'United States'].join(', ')
}

function methodLabel(list, id) {
  return labelOf(list, id) || NOT_PROVIDED
}

export function getReviewDetails(order) {
  const travelers = order.travelers || []
  const applicants = travelers.map((traveler, index) => ({
    id: traveler.id,
    title: applicantTitle(traveler, index),
    rows: [
      { label: 'Residence', value: residenceValue(traveler) },
      ...(index === 0 ? [{ label: 'Contact', value: contactValue(traveler) }] : []),
    ],
  }))
  const services = travelers.map((traveler, index) => {
    const lines = selectionsInChoiceOrder(selectionsOf(traveler))
      .map((selection) => serviceLine(order, traveler, selection))
    return {
      id: traveler.id,
      title: applicantTitle(traveler, index),
      rows: lines.length ? lines : [{ label: 'Services', value: NOT_PROVIDED }],
    }
  })
  const included = additionalServiceList
    .filter((service) => isAdditionalServiceChecked(order, service.id))
    .map((service) => service.label)
  const packageName = packages.find((item) => item.id === order.vipPackageId)?.name || 'No package'
  const delivery = deliveryRequired(order)
    ? {
        skipped: false,
        message: '',
        rows: [
          {
            label: 'Sending to us',
            value: methodLabel(shippingMethods.inbound, order.delivery?.inboundShippingId),
          },
          {
            label: 'Return to you',
            value: methodLabel(shippingMethods.return, order.delivery?.returnShippingId),
          },
          { label: 'Address', value: addressLine(order.delivery?.address) },
          ...(text(order.delivery?.note) ? [{ label: 'Note', value: text(order.delivery.note) }] : []),
        ],
      }
    : {
        skipped: true,
        message: deliverySkippedMessage(order),
        rows: [],
      }

  return {
    trip: [
      { label: 'Documents back by', value: text(order.trip?.passportBackDate) || NOT_PROVIDED },
      { label: 'Travel date', value: text(order.trip?.travelDate) || NOT_SET },
      { label: 'Corporate account', value: order.corporate?.hasAccount ? 'Yes' : 'No' },
    ],
    applicants,
    services,
    vip: [
      { label: 'Package', value: packageName },
      { label: 'Included services', value: included.join(', ') || NOT_PROVIDED },
    ],
    delivery,
  }
}

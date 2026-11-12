import states from '../mocks/states.json'
import { getValidCorporateAccount } from './totals.js'

// Returns the order with the delivery address prefilled, or the same order when nothing is due.
// 1) Once, from the first Applicant (name, phone, state of residence) into empty fields.
// 2) Once per validated corporate account, from the account's known delivery details.
// Afterwards the fields belong to the user.
export function prefillDelivery(order) {
  const corporate = getValidCorporateAccount(order)
  const corporateDue = corporate && order.delivery.corporatePrefilled !== order.corporate.accountNumber
  if (order.delivery.addressPrefilled && !corporateDue) return order

  let address = order.delivery.address
  let { addressPrefilled, corporatePrefilled } = order.delivery

  if (!addressPrefilled) {
    const [first] = order.travelers
    const fullName = [first?.firstName, first?.lastName].map((part) => part?.trim()).filter(Boolean).join(' ')
    const prefill = {}
    if (!address.fullName && fullName) prefill.fullName = fullName
    if (!address.phone && first?.phone) prefill.phone = first.phone
    if (!address.state && states.some((item) => item.id === first?.stateOfResidence)) {
      prefill.state = first.stateOfResidence
    }
    address = { ...address, ...prefill }
    addressPrefilled = true
  }

  if (corporateDue) {
    address = { ...address, ...corporate.delivery }
    corporatePrefilled = order.corporate.accountNumber
  }

  return { ...order, delivery: { ...order.delivery, addressPrefilled, corporatePrefilled, address } }
}

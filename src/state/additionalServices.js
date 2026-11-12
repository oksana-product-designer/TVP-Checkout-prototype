import services from '../mocks/additional-services.json'

export const additionalServiceList = services

export function isAdditionalServiceChecked(order, id) {
  if (order.vipPackageId) return true
  return order.additionalServices?.[id] !== false
}

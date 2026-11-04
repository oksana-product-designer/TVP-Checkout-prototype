import { useState } from 'react'
import { emptyServices } from '../../state/initialOrder.js'
import { useOrder } from '../../state/useOrder.js'
import { serviceRows, travelerServiceErrorCount } from '../../state/validation.js'
import { TravelerServiceCard } from './TravelerServiceCard.jsx'
import { TripDatesCard } from './TripDatesCard.jsx'

export function ServiceStep({ attempted = false, revealToken = 0 }) {
  const { order, setOrder } = useOrder()
  const [openId, setOpenId] = useState(() => order.travelers[0]?.id ?? null)
  const [seenReveal, setSeenReveal] = useState(revealToken)
  const multiple = order.travelers.length > 1

  if (revealToken !== seenReveal) {
    setSeenReveal(revealToken)
    const openTraveler = order.travelers.find((traveler) => traveler.id === openId)
    const openErrors = openTraveler ? travelerServiceErrorCount(order, openTraveler) : 0
    if (openErrors === 0) {
      const firstInvalid = order.travelers.find(
        (traveler) => travelerServiceErrorCount(order, traveler) > 0,
      )
      if (firstInvalid) setOpenId(firstInvalid.id)
    }
  }

  function patchTrip(field, value) {
    setOrder((current) => ({
      ...current,
      trip: { ...current.trip, [field]: value },
    }))
  }

  function patchService(travelerId, kind, serviceId, patch) {
    setOrder((current) => {
      const traveler = current.travelers.find((item) => item.id === travelerId)
      if (!traveler) return current
      const rows = serviceRows(current, traveler)
      const nextRows = rows[kind].map((row) => (
        row.serviceId === serviceId ? { ...row, ...patch } : row
      ))
      const existing = current.servicesByTraveler[travelerId] || emptyServices()

      return {
        ...current,
        servicesByTraveler: {
          ...current.servicesByTraveler,
          [travelerId]: {
            ...existing,
            [kind]: nextRows,
          },
        },
      }
    })
  }

  return (
    <>
      <TripDatesCard
        passportBackDate={order.trip.passportBackDate}
        travelDate={order.trip.travelDate}
        showErrors={attempted}
        onChange={patchTrip}
      />
      {order.travelers.map((traveler, index) => (
        <TravelerServiceCard
          key={traveler.id}
          order={order}
          traveler={traveler}
          index={index}
          multiple={multiple}
          open={!multiple || openId === traveler.id}
          showErrors={attempted}
          onToggle={() => {
            setOpenId((current) => (current === traveler.id ? null : traveler.id))
          }}
          onPassportChange={(travelerId, serviceId, patch) => {
            patchService(travelerId, 'passport', serviceId, patch)
          }}
          onVisaChange={(travelerId, serviceId, patch) => {
            patchService(travelerId, 'visa', serviceId, patch)
          }}
        />
      ))}
    </>
  )
}

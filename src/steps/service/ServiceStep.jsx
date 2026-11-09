import { useState } from 'react'
import { emptyServices, nextSelectionId, selectionsOf } from '../../state/initialOrder.js'
import { useOrder } from '../../state/useOrder.js'
import { travelerServiceErrorCount } from '../../state/validation.js'
import { TravelerServiceCard } from './TravelerServiceCard.jsx'

function blankPassport(serviceId) {
  return { serviceId, pages: '', processingSpeed: '', passportCard: false }
}

function blankVisa(serviceId) {
  return { serviceId, visaType: '', processingSpeed: '', entries: '', validityPeriod: '' }
}

function applySelections(current, travelerId, selections, serviceKind) {
  const traveler = current.travelers.find((item) => item.id === travelerId)
  if (!traveler) return current

  const passportServiceIds = selections
    .filter((item) => item.kind === 'passport' && item.serviceId)
    .map((item) => item.serviceId)
  const visaServiceIds = selections
    .filter((item) => item.kind === 'visa' && item.serviceId)
    .map((item) => item.serviceId)
  const existing = current.servicesByTraveler[travelerId] || emptyServices()
  const passportStored = Array.isArray(existing.passport) ? existing.passport : []
  const visaStored = Array.isArray(existing.visa) ? existing.visa : []

  return {
    ...current,
    travelers: current.travelers.map((item) => (
      item.id === travelerId
        ? {
            ...item,
            serviceSelections: selections,
            serviceKind,
            passportServiceIds,
            visaServiceIds,
          }
        : item
    )),
    servicesByTraveler: {
      ...current.servicesByTraveler,
      [travelerId]: {
        passport: passportServiceIds.map((serviceId) => (
          passportStored.find((row) => row.serviceId === serviceId) || blankPassport(serviceId)
        )),
        visa: visaServiceIds.map((serviceId) => (
          visaStored.find((row) => row.serviceId === serviceId) || blankVisa(serviceId)
        )),
      },
    },
  }
}

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

  function changeSelectionKind(travelerId, selectionId, kind) {
    setOrder((current) => {
      const traveler = current.travelers.find((item) => item.id === travelerId)
      if (!traveler) return current
      const selections = selectionsOf(traveler).map((item) => {
        if (item.id !== selectionId || item.kind === kind) return item
        return { ...item, kind, serviceId: '' }
      })
      return applySelections(current, travelerId, selections, traveler.serviceKind || 'passport')
    })
  }

  function chooseService(travelerId, selectionId, serviceId) {
    setOrder((current) => {
      const traveler = current.travelers.find((item) => item.id === travelerId)
      if (!traveler) return current
      const selections = selectionsOf(traveler).map((item) => (
        item.id === selectionId ? { ...item, serviceId } : item
      ))
      return applySelections(current, travelerId, selections, traveler.serviceKind || 'passport')
    })
  }

  function addService(travelerId) {
    setOrder((current) => {
      const traveler = current.travelers.find((item) => item.id === travelerId)
      if (!traveler) return current
      const selections = selectionsOf(traveler)
      return applySelections(
        current,
        travelerId,
        [...selections, { id: nextSelectionId(selections), kind: 'passport', serviceId: '' }],
        traveler.serviceKind || 'passport',
      )
    })
  }

  function removeService(travelerId, selectionId) {
    setOrder((current) => {
      const traveler = current.travelers.find((item) => item.id === travelerId)
      if (!traveler) return current
      const selections = selectionsOf(traveler)
      if (selections.length <= 1) return current
      return applySelections(
        current,
        travelerId,
        selections.filter((item) => item.id !== selectionId),
        traveler.serviceKind || 'passport',
      )
    })
  }

  function patchService(travelerId, kind, serviceId, patch) {
    setOrder((current) => {
      const traveler = current.travelers.find((item) => item.id === travelerId)
      if (!traveler) return current
      const existing = current.servicesByTraveler[travelerId] || emptyServices()
      const list = Array.isArray(existing[kind]) ? existing[kind] : []
      const nextRows = list.map((row) => (
        row.serviceId === serviceId ? { ...row, ...patch } : row
      ))

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
          onKindChange={changeSelectionKind}
          onChoose={chooseService}
          onAdd={addService}
          onRemove={removeService}
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

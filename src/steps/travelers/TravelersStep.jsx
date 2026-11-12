import { useState } from 'react'
import { Card } from '../../components/organisms/Card.jsx'
import { ConfirmationDialog } from '../../components/organisms/ConfirmationDialog.jsx'
import { CorporateAccount } from '../../components/organisms/CorporateAccount.jsx'
import corporateAccounts from '../../mocks/corporate-accounts.json'
import { createTraveler, emptyServices } from '../../state/initialOrder.js'
import { isSpeedAvailable } from '../../state/processingSpeeds.js'
import { useOrder } from '../../state/useOrder.js'
import { TripDatesCard } from '../service/TripDatesCard.jsx'
import { AffiliateBanner } from './AffiliateBanner.jsx'
import { TravelerDetailsSection } from './TravelerDetailsSection.jsx'
import './TravelersStep.css'

function nextTravelerId(travelers) {
  const max = travelers.reduce((highest, traveler) => {
    const number = Number(String(traveler.id).replace(/\D/g, ''))
    return Number.isFinite(number) ? Math.max(highest, number) : highest
  }, 0)
  return `t${max + 1}`
}

export function TravelersStep({ attempted = false }) {
  const { order, setOrder } = useOrder()
  const [pendingRemoveId, setPendingRemoveId] = useState(null)
  const pendingIndex = order.travelers.findIndex((traveler) => traveler.id === pendingRemoveId)

  function patchTrip(field, value) {
    setOrder((current) => {
      if (field !== 'passportBackDate') return { ...current, trip: { ...current.trip, [field]: value } }
      // A chosen speed that can no longer meet the new date is cleared so it is picked again.
      const keepSpeed = (row) => (
        row.processingSpeed && !isSpeedAvailable(row.processingSpeed, value)
          ? { ...row, processingSpeed: '' }
          : row
      )
      const servicesByTraveler = Object.fromEntries(
        Object.entries(current.servicesByTraveler).map(([id, services]) => [
          id,
          { ...services, passport: services.passport.map(keepSpeed), visa: services.visa.map(keepSpeed) },
        ]),
      )
      return { ...current, trip: { ...current.trip, [field]: value }, servicesByTraveler }
    })
  }

  function patchTraveler(id, patch) {
    setOrder((current) => ({
      ...current,
      travelers: current.travelers.map((traveler) => (
        traveler.id === id ? { ...traveler, ...patch } : traveler
      )),
    }))
  }

  function addTraveler() {
    setOrder((current) => {
      const id = nextTravelerId(current.travelers)
      return {
        ...current,
        travelers: [...current.travelers, createTraveler(id)],
        servicesByTraveler: {
          ...current.servicesByTraveler,
          [id]: emptyServices(),
        },
      }
    })
  }

  function removeTraveler(id) {
    setOrder((current) => {
      const servicesByTraveler = { ...current.servicesByTraveler }
      delete servicesByTraveler[id]
      return {
        ...current,
        travelers: current.travelers.filter((traveler) => traveler.id !== id),
        servicesByTraveler,
      }
    })
    setPendingRemoveId(null)
  }

  return (
    <>
      <AffiliateBanner />
      <Card>
        <CorporateAccount
          hasAccount={order.corporate.hasAccount}
          accountNumber={order.corporate.accountNumber}
          status={order.corporate.status}
          showEmptyError={attempted && order.corporate.hasAccount}
          onHasAccountChange={(hasAccount) => {
            setOrder((current) => ({
              ...current,
              corporate: { ...current.corporate, hasAccount },
            }))
          }}
          onAccountNumberChange={(accountNumber) => {
            setOrder((current) => ({
              ...current,
              corporate: { ...current.corporate, accountNumber, status: 'idle' },
            }))
          }}
          learnMore={order.corporate.learnMore}
          onLearnMoreChange={(learnMore) => {
            setOrder((current) => ({
              ...current,
              corporate: { ...current.corporate, learnMore },
            }))
          }}
          onValidate={(accountNumber) => {
            const match = corporateAccounts.find((account) => account.accountNumber === accountNumber)
            setOrder((current) => ({
              ...current,
              corporate: {
                ...current.corporate,
                status: match?.valid ? 'valid' : 'invalid',
              },
            }))
          }}
        />
      </Card>
      <TripDatesCard
        passportBackDate={order.trip.passportBackDate}
        travelDate={order.trip.travelDate}
        showErrors={attempted}
        onChange={patchTrip}
      />
      <Card>
        <div className="travelers-step__sections">
        {order.travelers.map((traveler, index) => (
          <TravelerDetailsSection
            key={traveler.id}
            traveler={traveler}
            index={index}
            count={order.travelers.length}
            showErrors={attempted}
            onChange={(field, value) => patchTraveler(traveler.id, { [field]: value })}
            onAdd={addTraveler}
            onRemove={() => setPendingRemoveId(traveler.id)}
          />
        ))}
        </div>
      </Card>
      <ConfirmationDialog
        open={pendingRemoveId !== null}
        title={`Remove Applicant ${pendingIndex + 1}?`}
        message="Their details and the services selected for them will be deleted. This cannot be undone."
        onCancel={() => setPendingRemoveId(null)}
        onConfirm={() => removeTraveler(pendingRemoveId)}
      />
    </>
  )
}

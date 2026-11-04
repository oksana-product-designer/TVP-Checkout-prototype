import { useState } from 'react'
import { Card } from '../../components/organisms/Card.jsx'
import { ConfirmationDialog } from '../../components/organisms/ConfirmationDialog.jsx'
import { CorporateAccount } from '../../components/organisms/CorporateAccount.jsx'
import corporateAccounts from '../../mocks/corporate-accounts.json'
import { createTraveler, emptyServices, visaIdsOf } from '../../state/initialOrder.js'
import { useOrder } from '../../state/useOrder.js'
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

  function patchTraveler(id, patch) {
    setOrder((current) => {
      const travelers = current.travelers.map((traveler) =>
        traveler.id === id ? { ...traveler, ...patch } : traveler,
      )
      const servicesByTraveler = { ...current.servicesByTraveler }
      const currentServices = servicesByTraveler[id] || emptyServices()
      let services = currentServices

      if (patch.passportServiceIds) {
        const passportList = Array.isArray(currentServices.passport) ? currentServices.passport : []
        services = {
          ...services,
          passport: patch.passportServiceIds.map((serviceId) => {
            const existing = passportList.find((item) => item.serviceId === serviceId)
            return existing || { serviceId, pages: '', processingSpeed: '', passportCard: false }
          }),
        }
      }

      if (patch.visaServiceIds) {
        const visaList = Array.isArray(currentServices.visa) ? currentServices.visa : []
        services = {
          ...services,
          visa: patch.visaServiceIds.map((serviceId) => {
            const existing = visaList.find((item) => item.serviceId === serviceId)
            return existing || { serviceId, visaType: '', entries: '', validityPeriod: '' }
          }),
        }
      }

      if (patch.passportServiceIds || patch.visaServiceIds) {
        servicesByTraveler[id] = services
      }

      return { ...current, travelers, servicesByTraveler }
    })
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

  function togglePassport(id, option) {
    toggleIds(id, 'passportServiceIds', option.id)
  }

  function toggleVisa(id, option) {
    toggleIds(id, 'visaServiceIds', option.id)
  }

  function toggleIds(id, key, optionId) {
    const traveler = order.travelers.find((item) => item.id === id)
    if (!traveler) return
    const currentIds = key === 'visaServiceIds' ? visaIdsOf(traveler) : traveler[key] || []
    const nextIds = currentIds.includes(optionId)
      ? currentIds.filter((serviceId) => serviceId !== optionId)
      : [...currentIds, optionId]
    patchTraveler(id, { [key]: nextIds })
  }

  return (
    <>
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
            onTogglePassport={(option) => togglePassport(traveler.id, option)}
            onToggleVisa={(option) => toggleVisa(traveler.id, option)}
            onAdd={addTraveler}
            onRemove={() => setPendingRemoveId(traveler.id)}
          />
        ))}
        </div>
      </Card>
      <ConfirmationDialog
        open={pendingRemoveId !== null}
        title={`Remove Traveller ${pendingIndex + 1}?`}
        message="Their details and the services selected for them will be deleted. This cannot be undone."
        onCancel={() => setPendingRemoveId(null)}
        onConfirm={() => removeTraveler(pendingRemoveId)}
      />
    </>
  )
}

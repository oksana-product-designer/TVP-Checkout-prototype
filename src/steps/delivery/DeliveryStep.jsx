import { useEffect, useState } from 'react'
import { Button } from '../../components/atoms/Button.jsx'
import { InputField } from '../../components/atoms/InputField.jsx'
import { TextLink } from '../../components/atoms/TextLink.jsx'
import { FormRow } from '../../components/molecules/FormRow.jsx'
import { Card } from '../../components/organisms/Card.jsx'
import { FormSection } from '../../components/organisms/FormSection.jsx'
import cities from '../../mocks/cities.json'
import shippingMethods from '../../mocks/shipping-methods.json'
import states from '../../mocks/states.json'
import { prefillDelivery } from '../../state/deliveryPrefill.js'
import { useOrder } from '../../state/useOrder.js'
import { addressRequired, deliveryErrors, deliveryRequired, deliverySkippedMessage, formatPhone, formatZip, validateField, validateFullName } from '../../state/validation.js'
import './DeliveryStep.css'

export function DeliveryStep({ attempted = false }) {
  const { order, setOrder } = useOrder()
  const delivery = order.delivery
  const address = delivery.address
  const note = String(delivery.note || '')
  const [noteOpen, setNoteOpen] = useState(() => Boolean(note.trim()))
  const addressActive = addressRequired(delivery)
  const errors = attempted ? deliveryErrors(order) : {}
  const phoneMessage = validateField('phone', address.phone)
  const phoneError = addressActive && phoneMessage && (attempted || address.phone) ? phoneMessage : ''
  const nameMessage = validateFullName(address.fullName)
  const nameError = addressActive && nameMessage && (attempted || address.fullName) ? nameMessage : ''
  const showNote = noteOpen || Boolean(note.trim())
  const required = deliveryRequired(order)

  useEffect(() => {
    if (!required) return
    setOrder(prefillDelivery)
  }, [required, order.corporate.status, order.corporate.accountNumber, order.corporate.hasAccount, setOrder])

  function patchDelivery(patch) {
    setOrder((current) => ({
      ...current,
      delivery: { ...current.delivery, ...patch },
    }))
  }

  function removeNote() {
    setNoteOpen(false)
    patchDelivery({ note: '' })
  }

  function patchAddress(patch) {
    setOrder((current) => ({
      ...current,
      delivery: {
        ...current.delivery,
        address: { ...current.delivery.address, ...patch },
      },
    }))
  }

  if (!required) {
    return (
      <Card>
        <p className="delivery-step__empty">{deliverySkippedMessage(order)}</p>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <FormSection title="Shipping methods">
          <FormRow>
            <InputField
              type="Select"
              label="Inbound Shipping"
              required
              value={delivery.inboundShippingId}
              options={shippingMethods}
              placeholder="Select"
              errorMessage={errors.inboundShippingId || ''}
              onChange={(event) => patchDelivery({ inboundShippingId: event.target.value })}
            />
            <InputField
              type="Select"
              label="Return Shipping"
              required
              value={delivery.returnShippingId}
              options={shippingMethods}
              placeholder="Select"
              errorMessage={errors.returnShippingId || ''}
              onChange={(event) => patchDelivery({ returnShippingId: event.target.value })}
            />
          </FormRow>
        </FormSection>
      </Card>
      <Card>
        <FormSection title="Delivery address">
          <FormRow>
            <InputField
              label="Full name"
              disabled={!addressActive}
              required
              value={address.fullName}
              errorMessage={nameError}
              onChange={(event) => patchAddress({ fullName: event.target.value })}
            />
            <InputField
              label="Phone number"
              disabled={!addressActive}
              required
              value={address.phone}
              errorMessage={phoneError}
              onChange={(event) => patchAddress({ phone: formatPhone(event.target.value) })}
            />
          </FormRow>
          <InputField
            label="Company"
            disabled={!addressActive}
            value={address.company}
            onChange={(event) => patchAddress({ company: event.target.value })}
          />
          <InputField
            label="Street address"
            disabled={!addressActive}
            required
            value={address.street}
            errorMessage={errors.street || ''}
            onChange={(event) => patchAddress({ street: event.target.value })}
          />
          <FormRow>
            <InputField
              label="City"
              disabled={!addressActive}
              required
              value={address.city}
              options={cities}
              errorMessage={errors.city || ''}
              onChange={(event) => patchAddress({ city: event.target.value })}
              onSelectOption={(option) => {
                const patch = { city: option.city }
                if (states.some((item) => item.id === option.state)) patch.state = option.state
                patchAddress(patch)
              }}
            />
            <InputField
              type="Select"
              label="State"
              disabled={!addressActive}
              required
              value={address.state}
              options={states}
              placeholder="Select"
              errorMessage={errors.state || ''}
              onChange={(event) => patchAddress({ state: event.target.value })}
            />
          </FormRow>
          <FormRow>
            <InputField label="Country" required value="United States" disabled />
            <InputField
              label="Zip code"
              disabled={!addressActive}
              required
              value={address.zip}
              errorMessage={errors.zip || ''}
              onChange={(event) => patchAddress({ zip: formatZip(event.target.value) })}
            />
          </FormRow>
          {showNote ? (
            <div className="delivery-step__extra">
              <InputField
                label="Note to the order"
                value={note}
                onChange={(event) => patchDelivery({ note: event.target.value })}
              />
              <Button
                type="Link danger"
                label="Remove"
                showLeadingIcon
                leadingIcon="x"
                className="delivery-step__remove"
                onClick={removeNote}
              />
            </div>
          ) : (
            <TextLink
              label="Add a note to the order"
              onClick={() => setNoteOpen(true)}
            />
          )}
        </FormSection>
      </Card>
    </>
  )
}

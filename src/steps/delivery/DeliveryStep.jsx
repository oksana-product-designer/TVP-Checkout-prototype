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
import { useOrder } from '../../state/useOrder.js'
import { deliveryErrors, formatPhone, formatZip, validateField, validateFullName } from '../../state/validation.js'
import './DeliveryStep.css'

function stateIdsForCity(cityName) {
  const query = String(cityName || '').trim().toLowerCase()
  if (!query) return []
  const ids = []
  cities.forEach((item) => {
    if (item.city.toLowerCase() !== query) return
    if (!states.some((state) => state.id === item.state)) return
    if (!ids.includes(item.state)) ids.push(item.state)
  })
  return ids
}

export function DeliveryStep({ attempted = false }) {
  const { order, setOrder } = useOrder()
  const delivery = order.delivery
  const address = delivery.address
  const street2 = String(address.street2 || '')
  const [lineOpen, setLineOpen] = useState(() => Boolean(street2.trim()))
  const errors = attempted ? deliveryErrors(order) : {}
  const phoneMessage = validateField('phone', address.phone)
  const phoneError = phoneMessage && (attempted || address.phone) ? phoneMessage : ''
  const nameMessage = validateFullName(address.fullName)
  const nameError = nameMessage && (attempted || address.fullName) ? nameMessage : ''
  const showLine = lineOpen || Boolean(street2.trim())
  const suggestedStateIds = stateIdsForCity(address.city)
  const stateOptions = suggestedStateIds.length
    ? [
        ...states.filter((item) => suggestedStateIds.includes(item.id)),
        ...states.filter((item) => !suggestedStateIds.includes(item.id)),
      ]
    : states

  function patchDelivery(patch) {
    setOrder((current) => ({
      ...current,
      delivery: { ...current.delivery, ...patch },
    }))
  }

  function removeExtraLine() {
    setLineOpen(false)
    patchAddress({ street2: '' })
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

  useEffect(() => {
    const suggested = stateIdsForCity(address.city)
    let nextState = null
    if (suggested.length === 1 && address.state !== suggested[0]) nextState = suggested[0]
    else if (suggested.length > 1 && address.state && !suggested.includes(address.state)) nextState = ''
    if (nextState === null) return
    setOrder((current) => ({
      ...current,
      delivery: {
        ...current.delivery,
        address: { ...current.delivery.address, state: nextState },
      },
    }))
  }, [address.city, address.state, setOrder])

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
              required
              value={address.fullName}
              errorMessage={nameError}
              onChange={(event) => patchAddress({ fullName: event.target.value })}
            />
            <InputField
              label="Phone number"
              required
              value={address.phone}
              errorMessage={phoneError}
              onChange={(event) => patchAddress({ phone: formatPhone(event.target.value) })}
            />
          </FormRow>
          <InputField
            label="Company"
            value={address.company}
            onChange={(event) => patchAddress({ company: event.target.value })}
          />
          <InputField
            label="Street address"
            required
            value={address.street}
            errorMessage={errors.street || ''}
            onChange={(event) => patchAddress({ street: event.target.value })}
          />
          {showLine ? (
            <div className="delivery-step__extra">
              <InputField
                label="Address line 2"
                value={address.street2}
                onChange={(event) => patchAddress({ street2: event.target.value })}
              />
              <Button
                type="Link danger"
                label="Remove"
                showLeadingIcon
                leadingIcon="x"
                className="delivery-step__remove"
                onClick={removeExtraLine}
              />
            </div>
          ) : (
            <TextLink
              label="Add an additional line for address"
              onClick={() => setLineOpen(true)}
            />
          )}
          <FormRow>
            <InputField
              label="City"
              required
              value={address.city}
              options={cities}
              errorMessage={errors.city || ''}
              onChange={(event) => patchAddress({ city: event.target.value })}
              onSelectOption={(option) => patchAddress({ city: option.city })}
            />
            <InputField
              type="Select"
              label="State"
              required
              value={address.state}
              options={stateOptions}
              placeholder="Select"
              errorMessage={errors.state || ''}
              onChange={(event) => patchAddress({ state: event.target.value })}
            />
          </FormRow>
          <FormRow>
            <InputField label="Country" required value="United States" disabled />
            <InputField
              label="Zip code"
              required
              value={address.zip}
              errorMessage={errors.zip || ''}
              onChange={(event) => patchAddress({ zip: formatZip(event.target.value) })}
            />
          </FormRow>
        </FormSection>
      </Card>
    </>
  )
}

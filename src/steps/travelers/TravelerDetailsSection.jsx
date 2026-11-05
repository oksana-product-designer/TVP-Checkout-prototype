import { Button } from '../../components/atoms/Button.jsx'
import { Checkbox } from '../../components/atoms/Checkbox.jsx'
import { InputField } from '../../components/atoms/InputField.jsx'
import { FormRow } from '../../components/molecules/FormRow.jsx'
import { FormSection } from '../../components/organisms/FormSection.jsx'
import nationalities from '../../mocks/nationalities.json'
import passportServices from '../../mocks/passport-services.json'
import states from '../../mocks/states.json'
import visaServices from '../../mocks/visa-services.json'
import { visaIdsOf } from '../../state/initialOrder.js'
import { formatPhone, validateField } from '../../state/validation.js'
import './TravelerDetailsSection.css'

function fieldError(showErrors, traveler, field) {
  if (!showErrors) return ''
  const value = field === 'visaServiceIds' ? visaIdsOf(traveler) : traveler[field]
  return validateField(field, value) || ''
}

export function TravelerDetailsSection({
  traveler,
  index,
  count,
  showErrors,
  onChange,
  onTogglePassport,
  onToggleVisa,
  onAdd,
  onRemove,
}) {
  const passportChips = traveler.passportServiceIds
    .map((id) => passportServices.find((service) => service.id === id))
    .filter(Boolean)
    .map((service) => ({ id: service.id, label: service.label }))
  const visaChips = visaIdsOf(traveler)
    .map((id) => visaServices.find((service) => service.id === id))
    .filter(Boolean)
    .map((service) => ({ id: service.id, label: service.label }))

  const action =
    count > 1 ? (
      <Button type="Link danger" label="Remove" showLeadingIcon leadingIcon="x" onClick={onRemove} />
    ) : null

  return (
    <FormSection
      title={count === 1 ? "Traveller's details" : `Traveller ${index + 1}`}
      action={action}
      showDivider={index > 0}
    >
      <FormRow>
        <InputField
          label="First name"
          required
          value={traveler.firstName}
          errorMessage={fieldError(showErrors, traveler, 'firstName')}
          onChange={(event) => onChange('firstName', event.target.value)}
        />
        <InputField
          label="Last name"
          required
          value={traveler.lastName}
          errorMessage={fieldError(showErrors, traveler, 'lastName')}
          onChange={(event) => onChange('lastName', event.target.value)}
        />
      </FormRow>
      <FormRow>
        <InputField
          type="Select"
          label="Nationality"
          required
          value={traveler.nationality}
          options={nationalities}
          placeholder="Select"
          errorMessage={fieldError(showErrors, traveler, 'nationality')}
          onChange={(event) => onChange('nationality', event.target.value)}
        />
        <InputField
          type="Select"
          label="State of residence"
          required
          value={traveler.stateOfResidence}
          options={states}
          placeholder="Select"
          errorMessage={fieldError(showErrors, traveler, 'stateOfResidence')}
          onChange={(event) => onChange('stateOfResidence', event.target.value)}
        />
      </FormRow>
      {index === 0 ? (
        <>
          <FormRow>
            <InputField
              label="Email address"
              required
              infoIcon
              infoText="We send your order confirmation, receipt, and status updates to this address. We also use it to reach you if we need anything to complete your order."
              value={traveler.email}
              errorMessage={fieldError(showErrors, traveler, 'email')}
              onChange={(event) => onChange('email', event.target.value)}
            />
            <InputField
              label="Phone number"
              required
              infoIcon
              infoText="We use your phone number to reach you quickly if there is a problem with your documents or your delivery. We send text updates only if you tick the SMS box below."
              value={traveler.phone}
              errorMessage={fieldError(showErrors, traveler, 'phone')}
              onChange={(event) => onChange('phone', formatPhone(event.target.value))}
            />
          </FormRow>
          <Checkbox
            label="I consent to receive SMS updates about my order status"
            checked={traveler.smsConsent}
            onChange={(event) => onChange('smsConsent', event.target.checked)}
          />
        </>
      ) : null}
      <InputField
        type="Multi-select"
        label="Passport Services"
        required
        options={passportServices}
        chips={passportChips}
        placeholder="Select"
        errorMessage={fieldError(showErrors, traveler, 'passportServiceIds')}
        onToggleOption={onTogglePassport}
        onRemoveChip={(chip) => onTogglePassport(chip)}
      />
      <InputField
        type="Multi-select"
        label="Visa Services by Country"
        required
        options={visaServices}
        chips={visaChips}
        placeholder="Select"
        errorMessage={fieldError(showErrors, traveler, 'visaServiceIds')}
        onToggleOption={onToggleVisa}
        onRemoveChip={(chip) => onToggleVisa(chip)}
      />
      {index === count - 1 ? (
        <Button
          className="traveler-details__add"
          type="Link accent"
          label="Add traveller"
          showTrailingIcon
          trailingIcon="plus"
          onClick={onAdd}
        />
      ) : null}
    </FormSection>
  )
}

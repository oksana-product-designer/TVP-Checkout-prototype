import { InputField } from '../../components/atoms/InputField.jsx'
import { FormRow } from '../../components/molecules/FormRow.jsx'
import { FormSection } from '../../components/organisms/FormSection.jsx'
import { getSpeedOptions } from '../../state/processingSpeeds.js'
import { useOrder } from '../../state/useOrder.js'
import { visaFieldError } from '../../state/validation.js'

export function VisaServiceSection({
  visa,
  service,
  showDivider = false,
  showHeader = true,
  showErrors = false,
  onChange,
}) {
  const { order } = useOrder()
  const speedOptions = getSpeedOptions(order.trip.passportBackDate)
  const typeError = showErrors ? visaFieldError(service, 'visaType') : null
  const speedError = showErrors ? visaFieldError(service, 'processingSpeed') : null
  const entriesError = showErrors ? visaFieldError(service, 'entries') : null
  const validityError = showErrors ? visaFieldError(service, 'validityPeriod') : null

  return (
    <FormSection title={visa.sectionTitle} showDivider={showDivider} showHeader={showHeader}>
      <FormRow>
        <InputField
          type="Select"
          label="Visa type"
          required
          value={service.visaType}
          options={visa.visaTypes}
          errorMessage={typeError || ''}
          onChange={(event) => onChange({ visaType: event.target.value })}
        />
        <InputField
          type="Select"
          label="Processing speed"
          required
          value={service.processingSpeed || ''}
          options={speedOptions}
          errorMessage={speedError || ''}
          onChange={(event) => onChange({ processingSpeed: event.target.value })}
        />
      </FormRow>
      <FormRow>
        <InputField
          type="Select"
          label="Number of entries"
          required
          value={service.entries}
          options={visa.entries}
          errorMessage={entriesError || ''}
          onChange={(event) => onChange({ entries: event.target.value })}
        />
        <InputField
          type="Select"
          label="Validity period"
          required
          value={service.validityPeriod}
          options={visa.validityPeriods}
          errorMessage={validityError || ''}
          onChange={(event) => onChange({ validityPeriod: event.target.value })}
        />
      </FormRow>
    </FormSection>
  )
}

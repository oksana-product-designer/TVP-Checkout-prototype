import { Checkbox } from '../../components/atoms/Checkbox.jsx'
import { InputField } from '../../components/atoms/InputField.jsx'
import { FormRow } from '../../components/molecules/FormRow.jsx'
import { FormSection } from '../../components/organisms/FormSection.jsx'
import addons from '../../mocks/addons.json'
import passportPages from '../../mocks/passport-pages.json'
import { getSpeedOptions } from '../../state/processingSpeeds.js'
import { useOrder } from '../../state/useOrder.js'
import { passportFieldError } from '../../state/validation.js'
import './PassportServiceSection.css'

const passportCard = addons.find((item) => item.id === 'passport-card')

export function PassportServiceSection({
  title,
  service,
  showDivider = false,
  showHeader = true,
  showErrors = false,
  onChange,
}) {
  const { order } = useOrder()
  const speedOptions = getSpeedOptions(order.trip.passportBackDate)
  const pagesError = showErrors ? passportFieldError(service, 'pages') : null
  const speedError = showErrors ? passportFieldError(service, 'processingSpeed') : null

  return (
    <FormSection title={title} showDivider={showDivider} showHeader={showHeader}>
      <FormRow>
        <InputField
          type="Select"
          label="Number of pages"
          required
          value={service.pages}
          options={passportPages}
          errorMessage={pagesError || ''}
          onChange={(event) => onChange({ pages: event.target.value })}
        />
        <InputField
          type="Select"
          label="Processing speed"
          required
          value={service.processingSpeed}
          options={speedOptions}
          errorMessage={speedError || ''}
          onChange={(event) => onChange({ processingSpeed: event.target.value })}
        />
      </FormRow>
      {passportCard ? (
        <Checkbox
          className="passport-service__addon"
          showTitle
          title="Additional Options"
          label={passportCard.label}
          description={passportCard.description}
          showDescription
          checked={Boolean(service.passportCard)}
          onChange={(event) => onChange({ passportCard: event.target.checked })}
        />
      ) : null}
    </FormSection>
  )
}

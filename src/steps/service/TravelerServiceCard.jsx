import { useId } from 'react'
import { Badge } from '../../components/atoms/Badge.jsx'
import { Button } from '../../components/atoms/Button.jsx'
import { Divider } from '../../components/atoms/Divider.jsx'
import { InputField } from '../../components/atoms/InputField.jsx'
import { AccordionHeader } from '../../components/molecules/AccordionHeader.jsx'
import { ButtonGroup } from '../../components/molecules/ButtonGroup.jsx'
import { ButtonGroupItem } from '../../components/molecules/ButtonGroupItem.jsx'
import { Card } from '../../components/organisms/Card.jsx'
import passportServices from '../../mocks/passport-services.json'
import visaServices from '../../mocks/visa-services.json'
import { selectionsOf } from '../../state/initialOrder.js'
import { serviceRows, travelerServiceErrorCount } from '../../state/validation.js'
import { PassportServiceSection } from './PassportServiceSection.jsx'
import { VisaServiceSection } from './VisaServiceSection.jsx'
import './TravelerServiceCard.css'

const passportById = Object.fromEntries(passportServices.map((service) => [service.id, service]))
const visaById = Object.fromEntries(visaServices.map((service) => [service.id, service]))

function errorBadgeLabel(count) {
  return count === 1 ? '1 error' : `${count} errors`
}

function optionsFor(kind, selection, selections) {
  const catalog = kind === 'passport' ? passportServices : visaServices
  const taken = new Set(
    selections
      .filter((item) => item.kind === kind && item.id !== selection.id && item.serviceId)
      .map((item) => item.serviceId),
  )
  return catalog.filter((item) => !taken.has(item.id))
}

function ServiceBlock({
  selection,
  selections,
  rows,
  canRemove,
  showErrors,
  onKindChange,
  onChoose,
  onRemove,
  onPassportChange,
  onVisaChange,
}) {
  const label = selection.kind === 'passport' ? 'Choose passport service' : 'Choose country'
  const error = showErrors && !selection.serviceId
    ? (selection.kind === 'passport' ? 'Select a passport service' : 'Select a country')
    : ''
  const row = selection.serviceId
    ? rows[selection.kind]?.find((item) => item.serviceId === selection.serviceId)
    : null
  const passport = selection.kind === 'passport' ? passportById[selection.serviceId] : null
  const visa = selection.kind === 'visa' ? visaById[selection.serviceId] : null

  return (
    <div className="service-block">
      <ButtonGroup
        className="service-block__kind"
        label="Service"
        value={selection.kind}
        onChange={(next) => onKindChange(selection.id, next)}
      >
        <ButtonGroupItem value="passport" label="Passport service" />
        <ButtonGroupItem value="visa" label="Visa service" />
      </ButtonGroup>
      <InputField
        type="Select"
        label={label}
        required
        value={selection.serviceId}
        options={optionsFor(selection.kind, selection, selections)}
        placeholder="Select"
        errorMessage={error}
        onChange={(event) => onChoose(selection.id, event.target.value)}
      />
      {passport && row ? (
        <PassportServiceSection
          title={passport.label}
          service={row}
          showHeader={false}
          showErrors={showErrors}
          onChange={(patch) => onPassportChange(selection.serviceId, patch)}
        />
      ) : null}
      {visa && row ? (
        <VisaServiceSection
          visa={visa}
          service={row}
          showHeader={false}
          showErrors={showErrors}
          onChange={(patch) => onVisaChange(selection.serviceId, patch)}
        />
      ) : null}
      {canRemove ? (
        <Button
          className="service-block__remove"
          type="Link danger"
          label="Remove"
          showLeadingIcon
          leadingIcon="x"
          onClick={() => onRemove(selection.id)}
        />
      ) : null}
    </div>
  )
}

function ServiceEditor({
  traveler,
  showErrors,
  onKindChange,
  onChoose,
  onAdd,
  onRemove,
  onPassportChange,
  onVisaChange,
  rows,
}) {
  const selections = selectionsOf(traveler)

  return (
    <div className="traveler-service-card__sections">
      {selections.map((selection, index) => (
        <div key={selection.id}>
          {index > 0 ? (
            <div className="traveler-service-card__rule">
              <Divider />
            </div>
          ) : null}
          <ServiceBlock
            selection={selection}
            selections={selections}
            rows={rows}
            canRemove={selections.length > 1}
            showErrors={showErrors}
            onKindChange={(selectionId, kind) => onKindChange(traveler.id, selectionId, kind)}
            onChoose={(selectionId, serviceId) => onChoose(traveler.id, selectionId, serviceId)}
            onRemove={(selectionId) => onRemove(traveler.id, selectionId)}
            onPassportChange={(serviceId, patch) => onPassportChange(traveler.id, serviceId, patch)}
            onVisaChange={(serviceId, patch) => onVisaChange(traveler.id, serviceId, patch)}
          />
        </div>
      ))}
      <Button
        className="traveler-service-card__add"
        type="Link accent"
        label="Add another service"
        showTrailingIcon
        trailingIcon="plus"
        onClick={() => onAdd(traveler.id)}
      />
    </div>
  )
}

export function TravelerServiceCard({
  order,
  traveler,
  index,
  multiple = false,
  open = true,
  showErrors = false,
  onToggle,
  onKindChange,
  onChoose,
  onAdd,
  onRemove,
  onPassportChange,
  onVisaChange,
}) {
  const panelId = useId()
  const rows = serviceRows(order, traveler)
  const errorCount = travelerServiceErrorCount(order, traveler)
  const first = traveler.firstName.trim()
  const last = traveler.lastName.trim()
  const name = first && last ? `${first} ${last}` : ''
  const title = name ? `Applicant ${index + 1} | ${name}` : `Applicant ${index + 1}`
  let badge = null

  if (errorCount === 0) {
    badge = <Badge type="Success" label="Complete" />
  } else if (showErrors) {
    badge = <Badge type="Error" label={errorBadgeLabel(errorCount)} />
  }

  const editor = (
    <ServiceEditor
      traveler={traveler}
      rows={rows}
      showErrors={showErrors}
      onKindChange={onKindChange}
      onChoose={onChoose}
      onAdd={onAdd}
      onRemove={onRemove}
      onPassportChange={onPassportChange}
      onVisaChange={onVisaChange}
    />
  )

  if (!multiple) {
    return <Card>{editor}</Card>
  }

  return (
    <Card>
      <div className="traveler-service-card">
        <AccordionHeader
          state={open ? 'Open' : 'Closed'}
          title={title}
          badge={badge}
          controls={panelId}
          onClick={onToggle}
        />
        <div id={panelId} hidden={!open}>
          <div className="traveler-service-card__rule">
            <Divider />
          </div>
          {editor}
        </div>
      </div>
    </Card>
  )
}

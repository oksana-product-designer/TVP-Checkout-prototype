import { useId, useState } from 'react'
import { Badge } from '../../components/atoms/Badge.jsx'
import { Button } from '../../components/atoms/Button.jsx'
import { ChoiceChip } from '../../components/atoms/ChoiceChip.jsx'
import { Divider } from '../../components/atoms/Divider.jsx'
import { InputField } from '../../components/atoms/InputField.jsx'
import { AccordionHeader } from '../../components/molecules/AccordionHeader.jsx'
import { Card } from '../../components/organisms/Card.jsx'
import { ConfirmationDialog } from '../../components/organisms/ConfirmationDialog.jsx'
import { FormSection } from '../../components/organisms/FormSection.jsx'
import passportServices from '../../mocks/passport-services.json'
import visaServices from '../../mocks/visa-services.json'
import { selectionsOf } from '../../state/initialOrder.js'
import { DEFAULT_PASSPORT_PAGES, serviceRows, travelerServiceErrorCount } from '../../state/validation.js'
import { PassportServiceSection } from './PassportServiceSection.jsx'
import { VisaServiceSection } from './VisaServiceSection.jsx'
import { MAX_SERVICES, selectionsInChoiceOrder, SERVICE_CHOICES } from './serviceChoices.js'
import './TravelerServiceCard.css'

const passportById = Object.fromEntries(passportServices.map((service) => [service.id, service]))
const visaById = Object.fromEntries(visaServices.map((service) => [service.id, service]))

function errorBadgeLabel(count) {
  return count === 1 ? '1 error' : `${count} errors`
}

function serviceIsFilled(selection) {
  return Boolean(selection.serviceId)
}

function detailsAreFilled(kind, row) {
  if (!row) return false
  if (kind === 'passport') {
    return Boolean(row.processingSpeed)
      || Boolean(row.passportCard)
      || (Boolean(row.pages) && row.pages !== DEFAULT_PASSPORT_PAGES)
  }
  if (kind === 'visa') {
    return Boolean(row.visaType || row.processingSpeed || row.entries || row.validityPeriod)
  }
  return false
}

function ServiceDetails({
  selection,
  rows,
  showErrors,
  onChoose,
  onRemove,
  onPassportChange,
  onVisaChange,
}) {
  const countryError = showErrors && selection.kind === 'visa' && !selection.serviceId
    ? 'Select a country'
    : ''
  const passportChoiceError = showErrors && selection.kind === 'passport' && !selection.serviceId
    ? 'Select a passport service'
    : ''
  const row = selection.serviceId
    ? rows[selection.kind]?.find((item) => item.serviceId === selection.serviceId)
    : null
  const passport = selection.kind === 'passport' ? passportById[selection.serviceId] : null
  const visa = selection.kind === 'visa' ? visaById[selection.serviceId] : null
  const serviceTitle = SERVICE_CHOICES.find((choice) => choice.kind === selection.kind)?.label
  const choiceLocked = detailsAreFilled(selection.kind, row)

  return (
    <div className="service-block">
      <FormSection
        title={serviceTitle}
        action={(
          <Button
            type="Link danger"
            label="Remove"
            showLeadingIcon
            leadingIcon="x"
            aria-label={`Remove ${serviceTitle}`}
            onClick={onRemove}
          />
        )}
      >
        {selection.kind === 'passport' ? (
          <InputField
            type="Select"
            label="Select a passport service"
            required
            disabled={choiceLocked}
            value={selection.serviceId}
            options={passportServices}
            placeholder="Select"
            errorMessage={passportChoiceError}
            onChange={(event) => onChoose(selection.id, event.target.value)}
          />
        ) : null}
        {selection.kind === 'visa' ? (
          <InputField
            type="Select"
            label="Select a country"
            required
            disabled={choiceLocked}
            value={selection.serviceId}
            options={visaServices}
            placeholder="Select"
            errorMessage={countryError}
            onChange={(event) => onChoose(selection.id, event.target.value)}
          />
        ) : null}
        {passport && row ? (
          <PassportServiceSection
            className="service-block__fields"
            showHeader={false}
            service={row}
            showErrors={showErrors}
            onChange={(patch) => onPassportChange(selection.serviceId, patch)}
          />
        ) : null}
        {visa && row ? (
          <VisaServiceSection
            className="service-block__fields"
            visa={visa}
            service={row}
            showHeader={false}
            showErrors={showErrors}
            onChange={(patch) => onVisaChange(selection.serviceId, patch)}
          />
        ) : null}
      </FormSection>
    </div>
  )
}

function ServiceEditor({
  traveler,
  showErrors,
  onToggleService,
  onChoose,
  onPassportChange,
  onVisaChange,
  rows,
}) {
  const errorId = useId()
  const [pendingRemoveId, setPendingRemoveId] = useState(null)
  const selections = selectionsOf(traveler)
  const chosen = selectionsInChoiceOrder(selections)
  const visible = chosen.filter((selection) => selection.kind === 'passport' || selection.kind === 'visa')
  const pending = visible.find((selection) => selection.id === pendingRemoveId) || null
  const pendingTitle = SERVICE_CHOICES.find((choice) => choice.kind === pending?.kind)?.label || 'service'
  const atLimit = selections.length >= MAX_SERVICES
  const choiceError = showErrors && selections.length === 0 ? 'Select services to get started' : ''

  function removeService(selection) {
    const choice = SERVICE_CHOICES.find((item) => item.kind === selection.kind)
    if (!choice) return
    onToggleService(traveler.id, choice)
    setPendingRemoveId(null)
  }

  function requestRemove(selection) {
    if (serviceIsFilled(selection)) {
      setPendingRemoveId(selection.id)
      return
    }
    removeService(selection)
  }

  return (
    <div className="traveler-service-card__sections">
      <FormSection title="Select services to get started">
        <div
          className="service-choices"
          role="group"
          aria-label="Select services to get started"
          aria-describedby={choiceError ? errorId : undefined}
        >
          {SERVICE_CHOICES.map((choice) => {
            const selected = selections.find((item) => item.kind === choice.kind)
            return (
              <ChoiceChip
                key={choice.id}
                label={choice.label}
                selected={Boolean(selected)}
                disabled={!selected && atLimit}
                onClick={() => {
                  if (selected) requestRemove(selected)
                  else onToggleService(traveler.id, choice)
                }}
              />
            )
          })}
        </div>
        {choiceError ? (
          <p id={errorId} className="service-choices__error" role="alert">{choiceError}</p>
        ) : null}
      </FormSection>
      {visible.map((selection) => (
        <ServiceDetails
          key={selection.id}
          selection={selection}
          rows={rows}
          showErrors={showErrors}
          onChoose={(selectionId, serviceId) => onChoose(traveler.id, selectionId, serviceId)}
          onRemove={() => requestRemove(selection)}
          onPassportChange={(serviceId, patch) => onPassportChange(traveler.id, serviceId, patch)}
          onVisaChange={(serviceId, patch) => onVisaChange(traveler.id, serviceId, patch)}
        />
      ))}
      <ConfirmationDialog
        open={pending !== null}
        title={`Remove ${pendingTitle}?`}
        message="The details you entered for this service will be deleted. This cannot be undone."
        confirmLabel="Remove service"
        onCancel={() => setPendingRemoveId(null)}
        onConfirm={() => removeService(pending)}
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
  onToggleService,
  onChoose,
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
      onToggleService={onToggleService}
      onChoose={onChoose}
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

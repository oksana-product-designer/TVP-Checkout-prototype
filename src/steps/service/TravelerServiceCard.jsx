import { useId } from 'react'
import { Badge } from '../../components/atoms/Badge.jsx'
import { Divider } from '../../components/atoms/Divider.jsx'
import { AccordionHeader } from '../../components/molecules/AccordionHeader.jsx'
import { Card } from '../../components/organisms/Card.jsx'
import passportServices from '../../mocks/passport-services.json'
import visaServices from '../../mocks/visa-services.json'
import { serviceRows, travelerServiceErrorCount } from '../../state/validation.js'
import { PassportServiceSection } from './PassportServiceSection.jsx'
import { VisaServiceSection } from './VisaServiceSection.jsx'
import './TravelerServiceCard.css'

const passportById = Object.fromEntries(passportServices.map((service) => [service.id, service]))
const visaById = Object.fromEntries(visaServices.map((service) => [service.id, service]))

function errorBadgeLabel(count) {
  return count === 1 ? '1 error' : `${count} errors`
}

function ServiceSections({ rows, showErrors, onPassportChange, onVisaChange }) {
  const sections = []

  rows.passport.forEach((row) => {
    const service = passportById[row.serviceId]
    if (!service) return
    sections.push(
      <PassportServiceSection
        key={`passport-${row.serviceId}`}
        title={service.label}
        service={row}
        showDivider={sections.length > 0}
        showErrors={showErrors}
        onChange={(patch) => onPassportChange(row.serviceId, patch)}
      />,
    )
  })

  rows.visa.forEach((row) => {
    const visa = visaById[row.serviceId]
    if (!visa) return
    sections.push(
      <VisaServiceSection
        key={`visa-${row.serviceId}`}
        visa={visa}
        service={row}
        showDivider={sections.length > 0}
        showErrors={showErrors}
        onChange={(patch) => onVisaChange(row.serviceId, patch)}
      />,
    )
  })

  return <div className="traveler-service-card__sections">{sections}</div>
}

export function TravelerServiceCard({
  order,
  traveler,
  index,
  multiple = false,
  open = true,
  showErrors = false,
  onToggle,
  onPassportChange,
  onVisaChange,
}) {
  const panelId = useId()
  const rows = serviceRows(order, traveler)
  const errorCount = travelerServiceErrorCount(order, traveler)
  const first = traveler.firstName.trim()
  const last = traveler.lastName.trim()
  const name = first && last ? `${first} ${last}` : ''
  const title = name ? `Traveller ${index + 1} | ${name}` : `Traveller ${index + 1}`
  let badge = null

  if (errorCount === 0) {
    badge = <Badge type="Success" label="Complete" />
  } else if (showErrors) {
    badge = <Badge type="Error" label={errorBadgeLabel(errorCount)} />
  }

  const sections = (
    <ServiceSections
      rows={rows}
      showErrors={showErrors}
      onPassportChange={(serviceId, patch) => onPassportChange(traveler.id, serviceId, patch)}
      onVisaChange={(serviceId, patch) => onVisaChange(traveler.id, serviceId, patch)}
    />
  )

  if (!multiple) {
    return <Card>{sections}</Card>
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
          {sections}
        </div>
      </div>
    </Card>
  )
}

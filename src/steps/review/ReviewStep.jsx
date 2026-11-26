import { Button } from '../../components/atoms/Button.jsx'
import { Divider } from '../../components/atoms/Divider.jsx'
import { Card } from '../../components/organisms/Card.jsx'
import { FormSection } from '../../components/organisms/FormSection.jsx'
import { useOrder } from '../../state/useOrder.js'
import { getReviewDetails } from '../../state/reviewDetails.js'
import './ReviewStep.css'

function EditLink({ name, onClick }) {
  return (
    <Button
      type="Link"
      label="Edit"
      aria-label={name}
      onClick={onClick}
    />
  )
}

function ReviewRows({ rows }) {
  return (
    <dl className="review-step__rows">
      {rows.map((row) => (
        <div className="review-step__row" key={row.label}>
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function PersonBlock({ title, rows }) {
  return (
    <div className="review-step__group">
      <h3 className="review-step__person">{title}</h3>
      <ReviewRows rows={rows} />
    </div>
  )
}

export function ReviewStep({ onEdit }) {
  const { order } = useOrder()
  const details = getReviewDetails(order)

  return (
    <>
      <Card>
        <FormSection
          title="Trip and applicants"
          action={<EditLink name="Edit trip and applicants" onClick={() => onEdit(1)} />}
        >
          <div className="review-step__subsections">
            <ReviewRows rows={details.trip} />
            {details.applicants.map((applicant) => (
              <div className="review-step__subsection" key={applicant.id}>
                <Divider />
                <PersonBlock title={applicant.title} rows={applicant.rows} />
              </div>
            ))}
          </div>
        </FormSection>
      </Card>
      <Card>
        <FormSection
          title="Services"
          action={<EditLink name="Edit services" onClick={() => onEdit(2)} />}
        >
          <div className="review-step__subsections">
            {details.services.map((group, index) => (
              index === 0 ? (
                <PersonBlock key={group.id} title={group.title} rows={group.rows} />
              ) : (
                <div className="review-step__subsection" key={group.id}>
                  <Divider />
                  <PersonBlock title={group.title} rows={group.rows} />
                </div>
              )
            ))}
          </div>
        </FormSection>
      </Card>
      <Card>
        <FormSection
          title="VIP package and services"
          action={<EditLink name="Edit VIP package" onClick={() => onEdit(3)} />}
        >
          <ReviewRows rows={details.vip} />
        </FormSection>
      </Card>
      <Card>
        <FormSection
          title="Delivery"
          action={<EditLink name="Edit delivery" onClick={() => onEdit(4)} />}
        >
          {details.delivery.skipped ? (
            <p className="review-step__notice">{details.delivery.message}</p>
          ) : (
            <ReviewRows rows={details.delivery.rows} />
          )}
        </FormSection>
      </Card>
    </>
  )
}

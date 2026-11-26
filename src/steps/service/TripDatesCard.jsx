import { useRef, useState } from 'react'
import { InputFieldV2 } from '../../components/atoms/InputFieldV2.jsx'
import { Calendar } from '../../components/molecules/Calendar.jsx'
import { FormRow } from '../../components/molecules/FormRow.jsx'
import { Card } from '../../components/organisms/Card.jsx'
import { FormSection } from '../../components/organisms/FormSection.jsx'
import {
  formatDisplayDate,
  parseDisplayDate,
  validatePassportBackDate,
  validateTravelDate,
} from '../../state/validation.js'
import './TripDatesCard.css'

function DateField({
  id,
  label,
  required = false,
  value,
  errorMessage,
  open,
  onOpen,
  onClose,
  onChange,
}) {
  const rootRef = useRef(null)
  const [month, setMonth] = useState(() => parseDisplayDate(value) || new Date())

  function openCalendar() {
    if (!open) setMonth(parseDisplayDate(value) || new Date())
    onOpen()
    const input = rootRef.current?.querySelector('input')
    if (input && document.activeElement !== input) input.focus()
  }

  return (
    <div
      className={['date-field', open ? 'date-field--open' : ''].filter(Boolean).join(' ')}
      ref={rootRef}
      onClick={(event) => {
        if (event.target.closest('.date-field__popover')) return
        openCalendar()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose()
      }}
    >
      <InputFieldV2
        id={id}
        type="Date"
        label={label}
        required={required}
        value={value}
        errorMessage={errorMessage}
        onChange={(event) => onChange(event.target.value)}
        onFocus={openCalendar}
        onBlur={(event) => {
          if (!rootRef.current?.contains(event.relatedTarget)) onClose()
        }}
      />
      {open ? (
        <div
          className="date-field__popover"
          role="dialog"
          aria-label={label}
          onMouseDown={(event) => event.preventDefault()}
          onClick={(event) => event.stopPropagation()}
        >
          <Calendar
            month={month}
            onMonthChange={setMonth}
            selected={parseDisplayDate(value)}
            disablePast
            onSelect={(date) => {
              onChange(formatDisplayDate(date))
              onClose()
            }}
          />
        </div>
      ) : null}
    </div>
  )
}

export function TripDatesCard({
  passportBackDate,
  travelDate,
  showErrors = false,
  onChange,
}) {
  const [openField, setOpenField] = useState(null)
  const passportError = showErrors ? validatePassportBackDate(passportBackDate) : null
  const travelError = showErrors ? validateTravelDate(travelDate) : null

  return (
    <Card>
      <FormSection title="Trip dates">
        <FormRow>
          <DateField
            id="passport-back-date"
            label="Date you need the documents back"
            required
            value={passportBackDate}
            errorMessage={passportError || ''}
            open={openField === 'passport'}
            onOpen={() => setOpenField('passport')}
            onClose={() => setOpenField((current) => (current === 'passport' ? null : current))}
            onChange={(value) => onChange('passportBackDate', value)}
          />
          <DateField
            id="travel-date"
            label="Travel date"
            value={travelDate}
            errorMessage={travelError || ''}
            open={openField === 'travel'}
            onOpen={() => setOpenField('travel')}
            onClose={() => setOpenField((current) => (current === 'travel' ? null : current))}
            onChange={(value) => onChange('travelDate', value)}
          />
        </FormRow>
      </FormSection>
    </Card>
  )
}

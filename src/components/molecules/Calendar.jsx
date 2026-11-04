import { useMemo, useState } from 'react'
import { Icon } from '../../assets/icons/Icons.jsx'
import { CalendarDay } from '../atoms/CalendarDay.jsx'
import './Calendar.css'

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function sameDay(a, b) {
  if (!a || !b) return false
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function buildWeeks(monthDate) {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const first = new Date(year, month, 1)
  const mondayOffset = (first.getDay() + 6) % 7
  const start = new Date(year, month, 1 - mondayOffset)
  const weeks = []

  for (let week = 0; week < 6; week += 1) {
    const days = []
    for (let day = 0; day < 7; day += 1) {
      const date = new Date(start)
      date.setDate(start.getDate() + week * 7 + day)
      days.push(date)
    }
    weeks.push(days)
  }

  return weeks
}

function monthLabel(date) {
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

export function Calendar({
  month,
  selected,
  onSelect,
  onMonthChange,
  disablePast = true,
  className = '',
}) {
  const [internalMonth, setInternalMonth] = useState(() => startOfDay(new Date()))
  const [today] = useState(() => startOfDay(new Date()))
  const visibleMonth = month ? startOfDay(month) : internalMonth
  const weeks = useMemo(() => buildWeeks(visibleMonth), [visibleMonth])

  function shiftMonth(delta) {
    const next = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + delta, 1)
    if (month) onMonthChange?.(next)
    else setInternalMonth(next)
  }

  return (
    <div className={['calendar', className].filter(Boolean).join(' ')}>
      <div className="calendar__header">
        <button
          type="button"
          className="calendar__nav"
          aria-label="Previous month"
          onClick={() => shiftMonth(-1)}
        >
          <Icon name="arrow-left" />
        </button>
        <p className="calendar__month">{monthLabel(visibleMonth)}</p>
        <button
          type="button"
          className="calendar__nav"
          aria-label="Next month"
          onClick={() => shiftMonth(1)}
        >
          <Icon name="arrow-right" />
        </button>
      </div>

      <div className="calendar__weekdays">
        {WEEKDAYS.map((day) => (
          <span key={day} className="calendar__weekday">
            {day}
          </span>
        ))}
      </div>

      <div className="calendar__days">
        {weeks.map((week) => (
          <div key={week[0].toISOString()} className="calendar__week">
            {week.map((date) => {
              const outside = date.getMonth() !== visibleMonth.getMonth()
              const past = disablePast && startOfDay(date) < today
              let state = 'Default'
              if (sameDay(date, selected)) state = 'Selected'
              else if (sameDay(date, today)) state = 'Today'
              else if (past) state = 'Disabled'
              else if (outside) state = 'Outside'

              return (
                <CalendarDay
                  key={date.toISOString()}
                  className="calendar__day"
                  day={String(date.getDate())}
                  state={state}
                  disabled={past}
                  aria-label={date.toLocaleDateString('en-GB')}
                  onClick={() => {
                    if (past) return
                    onSelect?.(date)
                    if (outside) shiftMonth(date < visibleMonth ? -1 : 1)
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

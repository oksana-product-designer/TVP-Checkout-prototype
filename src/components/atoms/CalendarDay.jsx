import './CalendarDay.css'

export function CalendarDay({
  day = '1',
  state = 'Default',
  disabled = false,
  className = '',
  onClick,
  ...rest
}) {
  const isDisabled = disabled || state === 'Disabled'
  const classes = [
    'calendar-day',
    `calendar-day--${state.toLowerCase()}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={classes}
      disabled={isDisabled}
      aria-pressed={state === 'Selected' || undefined}
      aria-current={state === 'Today' ? 'date' : undefined}
      onClick={onClick}
      {...rest}
    >
      <span className="calendar-day__label">{day}</span>
    </button>
  )
}

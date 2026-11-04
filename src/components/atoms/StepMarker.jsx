import { Icon } from '../../assets/icons/Icons.jsx'
import './StepMarker.css'

export function StepMarker({ state = 'Current', number = '1', className = '' }) {
  const classes = [
    'step-marker',
    `step-marker--${state.toLowerCase()}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} aria-hidden="true">
      {state === 'Completed' ? (
        <Icon name="check" className="step-marker__check" />
      ) : (
        <span className="step-marker__number">{number}</span>
      )}
    </span>
  )
}

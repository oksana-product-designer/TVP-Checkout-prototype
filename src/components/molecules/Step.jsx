import { StepMarker } from '../atoms/StepMarker.jsx'
import './Step.css'

export function Step({ state = 'Current', number = '1', label, className = '' }) {
  const classes = ['step', `step--${state.toLowerCase()}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      <StepMarker state={state} number={number} />
      <span className="step__label">{label}</span>
    </div>
  )
}

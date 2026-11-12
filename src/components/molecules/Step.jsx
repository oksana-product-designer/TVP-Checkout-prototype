import { StepMarker } from '../atoms/StepMarker.jsx'
import './Step.css'

export function Step({ state = 'Current', number = '1', label, onSelect, className = '' }) {
  const classes = ['step', `step--${state.toLowerCase()}`, className]
    .filter(Boolean)
    .join(' ')
  const content = (
    <>
      <StepMarker state={state} number={number} />
      <span className="step__label">{label}</span>
    </>
  )

  if (!onSelect) {
    return <div className={classes}>{content}</div>
  }

  return (
    <button type="button" className={classes} onClick={onSelect}>
      {content}
    </button>
  )
}

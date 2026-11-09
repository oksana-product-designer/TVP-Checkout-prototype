import { Step } from '../molecules/Step.jsx'
import './StepIndicator.css'

const CHECKOUT_STEPS = [
  'Trip and applicants',
  'Service',
  'VIP Service',
  'Delivery',
  'Payment',
]

export function StepIndicator({
  currentStep = 1,
  reachedStep = 1,
  onStepSelect,
  className = '',
}) {
  const placed = currentStep === 'placed'

  return (
    <div className={['step-indicator', className].filter(Boolean).join(' ')} aria-label="Checkout progress">
      <span className="step-indicator__line" aria-hidden="true" />
      <ol className="step-indicator__steps">
        {CHECKOUT_STEPS.map((label, index) => {
          const number = index + 1
          let state = 'Upcoming'
          if (placed || (number !== currentStep && number <= reachedStep)) state = 'Completed'
          else if (number === currentStep) state = 'Current'
          const selectable = !placed && number <= reachedStep && typeof onStepSelect === 'function'

          return (
            <li key={label} className="step-indicator__step" aria-current={state === 'Current' ? 'step' : undefined}>
              <Step
                state={state}
                number={String(number)}
                label={label}
                onSelect={selectable ? () => onStepSelect(number) : undefined}
              />
            </li>
          )
        })}
      </ol>
    </div>
  )
}

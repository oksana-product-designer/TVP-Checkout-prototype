import { Step } from '../molecules/Step.jsx'
import './StepIndicator.css'

const CHECKOUT_STEPS = [
  'Travelers',
  'Service',
  'VIP Service',
  'Delivery',
  'Payment',
]

export function StepIndicator({ currentStep = 1, className = '' }) {
  const placed = currentStep === 'placed'

  return (
    <div className={['step-indicator', className].filter(Boolean).join(' ')} aria-label="Checkout progress">
      <span className="step-indicator__line" aria-hidden="true" />
      <ol className="step-indicator__steps">
        {CHECKOUT_STEPS.map((label, index) => {
          const number = index + 1
          let state = 'Upcoming'
          if (placed || number < currentStep) state = 'Completed'
          else if (number === currentStep) state = 'Current'

          return (
            <li key={label} className="step-indicator__step" aria-current={state === 'Current' ? 'step' : undefined}>
              <Step state={state} number={String(number)} label={label} />
            </li>
          )
        })}
      </ol>
    </div>
  )
}

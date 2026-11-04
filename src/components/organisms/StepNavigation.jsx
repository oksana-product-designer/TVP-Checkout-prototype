import { Button } from '../atoms/Button.jsx'
import './StepNavigation.css'

export function StepNavigation({
  first = false,
  nextEnabled = false,
  nextLabel = 'Next step',
  onPrevious,
  onNext,
  className = '',
}) {
  return (
    <div className={['step-navigation', className].filter(Boolean).join(' ')}>
      {first ? <span /> : (
        <Button
          type="Secondary"
          label="Previous step"
          onClick={onPrevious}
        />
      )}
      <Button
        type="Primary"
        label={nextLabel}
        showTrailingIcon={nextLabel === 'Next step'}
        trailingIcon="arrow-right"
        ariaDisabled={!nextEnabled}
        onClick={onNext}
      />
    </div>
  )
}

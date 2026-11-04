import { Button } from '../atoms/Button.jsx'
import { StepIndicator } from './StepIndicator.jsx'
import { TopBar } from './TopBar.jsx'
import './Header.css'

export function Header({
  showTopBar = true,
  showBackLink = true,
  currentStep = 1,
  onBack,
  className = '',
}) {
  return (
    <div className={['header', className].filter(Boolean).join(' ')}>
      {showTopBar ? <TopBar /> : null}
      <div className="header__step-bar">
        {showBackLink ? (
          <Button
            className="header__back"
            type="Link"
            label="Go back"
            showLeadingIcon
            leadingIcon="arrow-left"
            onClick={onBack}
          />
        ) : null}
        <StepIndicator currentStep={currentStep} />
      </div>
    </div>
  )
}

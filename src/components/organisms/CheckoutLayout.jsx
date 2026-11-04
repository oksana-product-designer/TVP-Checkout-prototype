import { TrustBadge } from '../molecules/TrustBadge.jsx'
import { Header } from './Header.jsx'
import { StepNavigation } from './StepNavigation.jsx'
import { SummarySidebar } from './SummarySidebar.jsx'
import './CheckoutLayout.css'

export function CheckoutLayout({
  title,
  currentStep = 1,
  showBackLink = true,
  onBack,
  first = currentStep === 1,
  nextEnabled = false,
  nextLabel = 'Next step',
  onPrevious,
  onNext,
  showNavigation = true,
  sidebar,
  children,
  className = '',
}) {
  const aside = sidebar === undefined ? <SummarySidebar /> : sidebar

  return (
    <div className={['checkout-layout', className].filter(Boolean).join(' ')}>
      <Header currentStep={currentStep} showBackLink={showBackLink} onBack={onBack} />
      <div className="checkout-layout__hero">
        <TrustBadge />
        {title ? <h1 className="checkout-layout__title">{title}</h1> : null}
      </div>
      <div className="checkout-layout__grid">
        <div className="checkout-layout__main">
          {children ? <div className="checkout-layout__cards">{children}</div> : null}
          {showNavigation ? (
            <StepNavigation
              first={first}
              nextEnabled={nextEnabled}
              nextLabel={nextLabel}
              onPrevious={onPrevious}
              onNext={onNext}
            />
          ) : null}
        </div>
        {aside ? <div className="checkout-layout__sidebar">{aside}</div> : null}
      </div>
    </div>
  )
}

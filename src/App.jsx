import { useState } from 'react'
import { CheckoutLayout } from './components/organisms/CheckoutLayout.jsx'
import { MobileTotalBar } from './components/organisms/MobileTotalBar.jsx'
import { SummaryContents } from './components/organisms/SummaryContents.jsx'
import { SummarySidebar } from './components/organisms/SummarySidebar.jsx'
import { getSummaryTree } from './state/summary.js'
import { formatMoney, getOrderTotal } from './state/totals.js'
import { initialOrder } from './state/initialOrder.js'
import { useMatchMedia } from './state/useMatchMedia.js'
import { useOrder } from './state/useOrder.js'
import { deliveryRequired, isStepValid } from './state/validation.js'
import { DeliveryStep } from './steps/delivery/DeliveryStep.jsx'
import { PaymentStep } from './steps/payment/PaymentStep.jsx'
import { OrderPlaced } from './steps/placed/OrderPlaced.jsx'
import { paymentActionLabel } from './steps/payment/paymentMethods.js'
import { ReviewStep } from './steps/review/ReviewStep.jsx'
import { ServiceStep } from './steps/service/ServiceStep.jsx'
import { TravelersStep } from './steps/travelers/TravelersStep.jsx'
import { VipStep } from './steps/vip/VipStep.jsx'

const STEP_TITLES = {
  1: 'Trip and applicants',
  2: 'Services',
  3: 'Service package',
  4: 'Delivery',
  5: 'Review your order',
  6: 'Payment',
  placed: 'Your order has been placed',
}

function App() {
  const { order, setOrder } = useOrder()
  const mobile = useMatchMedia('(max-width: 639px)')
  const [step, setStep] = useState(1)
  const [highestStep, setHighestStep] = useState(1)
  const [attempted, setAttempted] = useState(false)
  const [revealToken, setRevealToken] = useState(0)
  const [openGroups, setOpenGroups] = useState({})
  const summary = getSummaryTree(order)
  const total = formatMoney(getOrderTotal(order))
  const checkingOut = step !== 'placed'
  const showDesktopSummary = checkingOut && !mobile

  function toggleGroup(id) {
    setOpenGroups((current) => ({
      ...current,
      [id]: !current[id],
    }))
  }

  const reachedStep = Math.max(highestStep, typeof step === 'number' ? step : 1)

  function leaveStep(nextStep) {
    setStep(nextStep)
    setAttempted(false)
    if (typeof nextStep === 'number') {
      setHighestStep((current) => Math.max(current, nextStep))
    }
  }

  function handleStep(number) {
    if (number === step || number > reachedStep) return
    if (number > 4 && deliveryRequired(order) && !isStepValid(order, 4)) {
      leaveStep(4)
      return
    }
    leaveStep(number)
  }

  function handleNext() {
    if (!isStepValid(order, step)) {
      setAttempted(true)
      setRevealToken((current) => current + 1)
      return
    }
    if (step === 3 && !deliveryRequired(order)) leaveStep(5)
    else if (step < 6) leaveStep(step + 1)
    else if (step === 6) leaveStep('placed')
  }

  function handleHome() {
    setOrder(structuredClone(initialOrder))
    setAttempted(false)
    setRevealToken(0)
    setOpenGroups({})
    setHighestStep(1)
    setStep(1)
  }

  function handleBack() {
    if (step === 'placed') leaveStep(6)
    else if (step > 1) leaveStep(step - 1)
  }

  const nextLabel = step === 5
    ? 'Continue to payment'
    : step === 6
      ? paymentActionLabel(order.payment.method)
      : 'Next step'

  return (
    <CheckoutLayout
      className={[
        step === 'placed' ? 'checkout-layout--placed' : '',
        checkingOut && mobile ? 'checkout-layout--with-mobile-bar' : '',
      ].filter(Boolean).join(' ')}
      title={STEP_TITLES[step] || STEP_TITLES[2]}
      subtitle={step === 5 ? 'Check your details before you pay.' : ''}
      currentStep={step}
      reachedStep={reachedStep}
      onStepSelect={step === 'placed' ? undefined : handleStep}
      showBackLink={checkingOut || mobile}
      showNavigation={showDesktopSummary}
      nextEnabled={isStepValid(order, step)}
      nextLabel={nextLabel}
      onBack={step === 'placed' || step > 1 ? handleBack : undefined}
      onPrevious={handleBack}
      onNext={handleNext}
      sidebar={showDesktopSummary ? (
        <SummarySidebar total={total}>
          <SummaryContents summary={summary} openGroups={openGroups} onToggle={toggleGroup} />
        </SummarySidebar>
      ) : null}
      mobileBar={checkingOut && mobile ? (
        <MobileTotalBar
          total={total}
          summary={summary}
          nextEnabled={isStepValid(order, step)}
          nextLabel={nextLabel}
          onNext={handleNext}
        />
      ) : null}
    >
      {step === 1 ? <TravelersStep attempted={attempted} /> : null}
      {step === 2 ? <ServiceStep attempted={attempted} revealToken={revealToken} /> : null}
      {step === 3 ? <VipStep /> : null}
      {step === 4 ? <DeliveryStep attempted={attempted} /> : null}
      {step === 5 ? <ReviewStep onEdit={leaveStep} /> : null}
      {step === 6 ? <PaymentStep attempted={attempted} /> : null}
      {step === 'placed' ? <OrderPlaced onHome={handleHome} /> : null}
    </CheckoutLayout>
  )
}

export default App

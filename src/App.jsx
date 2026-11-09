import { useState } from 'react'
import { SummaryRow } from './components/molecules/SummaryRow.jsx'
import { CheckoutLayout } from './components/organisms/CheckoutLayout.jsx'
import { SummaryGroup } from './components/organisms/SummaryGroup.jsx'
import { SummarySidebar } from './components/organisms/SummarySidebar.jsx'
import { getSummaryTree } from './state/summary.js'
import { formatMoney, getOrderTotal } from './state/totals.js'
import { initialOrder } from './state/initialOrder.js'
import { useOrder } from './state/useOrder.js'
import { deliveryRequired, isStepValid } from './state/validation.js'
import { DeliveryStep } from './steps/delivery/DeliveryStep.jsx'
import { PaymentStep } from './steps/payment/PaymentStep.jsx'
import { OrderPlaced } from './steps/placed/OrderPlaced.jsx'
import { paymentActionLabel } from './steps/payment/paymentMethods.js'
import { ServiceStep } from './steps/service/ServiceStep.jsx'
import { TravelersStep } from './steps/travelers/TravelersStep.jsx'
import { VipStep } from './steps/vip/VipStep.jsx'

const STEP_TITLES = {
  1: 'Kick off your order',
  2: 'Trip and service details',
  3: 'Choose service package',
  4: 'Delivery details',
  5: 'Payment method',
  placed: 'Your order has been placed',
}

function renderServiceLines(lines, openGroups, onToggle) {
  return lines.map((line) => (
    line.children?.length ? (
      <SummaryGroup
        key={line.id}
        level="2"
        label={line.label}
        price={line.price}
        open={Boolean(openGroups[line.id])}
        onToggle={() => onToggle(line.id)}
      >
        {line.children.map((child) => (
          <SummaryRow key={child.id} level="3" label={child.label} price={child.price} />
        ))}
      </SummaryGroup>
    ) : (
      <SummaryRow key={line.id} level="2" label={line.label} price={line.price} />
    )
  ))
}

function App() {
  const { order, setOrder } = useOrder()
  const [step, setStep] = useState(1)
  const [highestStep, setHighestStep] = useState(1)
  const [attempted, setAttempted] = useState(false)
  const [revealToken, setRevealToken] = useState(0)
  const [openGroups, setOpenGroups] = useState({})
  const summary = getSummaryTree(order)

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
    else if (step < 5) leaveStep(step + 1)
    else if (step === 5) leaveStep('placed')
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
    if (step === 5 && !deliveryRequired(order)) leaveStep(3)
    else if (step > 1) leaveStep(step - 1)
  }

  return (
    <CheckoutLayout
      className={step === 'placed' ? 'checkout-layout--placed' : ''}
      title={STEP_TITLES[step] || STEP_TITLES[2]}
      currentStep={step}
      reachedStep={reachedStep}
      onStepSelect={step === 'placed' ? undefined : handleStep}
      showBackLink={step !== 'placed'}
      showNavigation={step !== 'placed'}
      nextEnabled={isStepValid(order, step)}
      nextLabel={step === 5 ? paymentActionLabel(order.payment.method) : 'Next step'}
      onBack={step > 1 ? handleBack : undefined}
      onPrevious={handleBack}
      onNext={handleNext}
      sidebar={step === 'placed' ? null : (
        <SummarySidebar
          total={formatMoney(getOrderTotal(order))}
        >
          {summary.map((group, index) => {
            if (group.children.length > 0) {
              return (
                <SummaryGroup
                  key={group.id}
                  label={group.label}
                  price={group.price}
                  open={Boolean(openGroups[group.id])}
                  onToggle={() => toggleGroup(group.id)}
                >
                  {renderServiceLines(group.children, openGroups, toggleGroup)}
                </SummaryGroup>
              )
            }
            const previous = summary[index - 1]?.kind
            const startsSection = (group.kind === 'order' && previous === 'applicant')
              || (group.kind === 'discount' && previous !== 'discount')
            return (
              <SummaryRow
                key={group.id}
                level="1"
                label={group.label}
                price={group.price}
                className={[startsSection ? 'summary-row--section-start' : '', group.kind === 'discount' ? 'summary-row--discount' : ''].filter(Boolean).join(' ')}
              />
            )
          })}
        </SummarySidebar>
      )}
    >
      {step === 1 ? <TravelersStep attempted={attempted} /> : null}
      {step === 2 ? <ServiceStep attempted={attempted} revealToken={revealToken} /> : null}
      {step === 3 ? <VipStep /> : null}
      {step === 4 ? <DeliveryStep attempted={attempted} /> : null}
      {step === 5 ? <PaymentStep attempted={attempted} /> : null}
      {step === 'placed' ? <OrderPlaced onHome={handleHome} /> : null}
    </CheckoutLayout>
  )
}

export default App

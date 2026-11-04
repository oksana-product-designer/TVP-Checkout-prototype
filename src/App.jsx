import { useState } from 'react'
import { SummaryRow } from './components/molecules/SummaryRow.jsx'
import { CheckoutLayout } from './components/organisms/CheckoutLayout.jsx'
import { SummaryGroup } from './components/organisms/SummaryGroup.jsx'
import { SummarySidebar } from './components/organisms/SummarySidebar.jsx'
import { getSummaryTree } from './state/summary.js'
import { findPromo, formatDiscount, formatMoney, getOrderTotal, getPromoDiscount } from './state/totals.js'
import { useOrder } from './state/useOrder.js'
import { isStepValid } from './state/validation.js'
import { DeliveryStep } from './steps/delivery/DeliveryStep.jsx'
import { ServiceStep } from './steps/service/ServiceStep.jsx'
import { TravelersStep } from './steps/travelers/TravelersStep.jsx'
import { VipStep } from './steps/vip/VipStep.jsx'

const STEP_TITLES = {
  1: 'Kick off your order',
  2: 'Trip and service details',
  3: 'Choose service package',
  4: 'Delivery details',
}

function renderServiceLines(lines, closedGroups, onToggle) {
  return lines.map((line) => (
    line.children?.length ? (
      <SummaryGroup
        key={line.id}
        level="2"
        label={line.label}
        price={line.price}
        open={!closedGroups[line.id]}
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
  const [attempted, setAttempted] = useState(false)
  const [revealToken, setRevealToken] = useState(0)
  const [promoView, setPromoView] = useState('link')
  const [closedGroups, setClosedGroups] = useState({})
  const summary = getSummaryTree(order)
  const promo = order.promo.appliedCode ? findPromo(order.promo.appliedCode) : null
  const view = promo ? 'applied' : promoView

  function toggleGroup(id) {
    setClosedGroups((current) => ({
      ...current,
      [id]: !current[id],
    }))
  }

  function leaveStep(nextStep) {
    setStep(nextStep)
    setAttempted(false)
  }

  function handleNext() {
    if (!isStepValid(order, step)) {
      setAttempted(true)
      setRevealToken((current) => current + 1)
      return
    }
    if (step < 4) leaveStep(step + 1)
  }

  function handleBack() {
    if (step > 1) leaveStep(step - 1)
  }

  function applyPromo(code) {
    const match = findPromo(code)
    if (!match) {
      setOrder((current) => ({
        ...current,
        promo: { ...current.promo, code, appliedCode: null },
      }))
      setPromoView('error')
      return
    }

    setOrder((current) => ({
      ...current,
      promo: { code: match.code, appliedCode: match.code },
    }))
    setPromoView('applied')
  }

  return (
    <CheckoutLayout
      title={STEP_TITLES[step] || STEP_TITLES[2]}
      currentStep={step}
      nextEnabled={isStepValid(order, step)}
      onBack={step > 1 ? handleBack : undefined}
      onPrevious={handleBack}
      onNext={handleNext}
      sidebar={
        <SummarySidebar
          total={formatMoney(getOrderTotal(order))}
          promoView={view}
          promoValue={order.promo.code}
          promoError="This promo code is not valid or has expired"
          promoLabel={promo?.label}
          promoDiscount={formatDiscount(getPromoDiscount(order))}
          onPromoOpen={() => setPromoView('form')}
          onPromoChange={(code) => {
            setOrder((current) => ({
              ...current,
              promo: { ...current.promo, code },
            }))
            if (promoView === 'error') setPromoView('form')
          }}
          onPromoApply={applyPromo}
          onPromoCancel={() => setPromoView('link')}
          onPromoRemove={() => {
            setOrder((current) => ({
              ...current,
              promo: { code: '', appliedCode: null },
            }))
            setPromoView('link')
          }}
        >
          {summary.map((group) =>
            group.children.length > 0 ? (
              <SummaryGroup
                key={group.id}
                label={group.label}
                price={group.price}
                open={!closedGroups[group.id]}
                onToggle={() => toggleGroup(group.id)}
              >
                {renderServiceLines(group.children, closedGroups, toggleGroup)}
              </SummaryGroup>
            ) : (
              <SummaryRow key={group.id} level="1" label={group.label} price={group.price} />
            ),
          )}
        </SummarySidebar>
      }
    >
      {step === 1 ? <TravelersStep attempted={attempted} /> : null}
      {step === 2 ? <ServiceStep attempted={attempted} revealToken={revealToken} /> : null}
      {step === 3 ? <VipStep /> : null}
      {step === 4 ? <DeliveryStep attempted={attempted} /> : null}
    </CheckoutLayout>
  )
}

export default App

import { useState } from 'react'
import { SummaryRow } from './components/molecules/SummaryRow.jsx'
import { CheckoutLayout } from './components/organisms/CheckoutLayout.jsx'
import { SummaryGroup } from './components/organisms/SummaryGroup.jsx'
import { SummarySidebar } from './components/organisms/SummarySidebar.jsx'
import { getSummaryTree } from './state/summary.js'
import { findPromo, formatDiscount, formatMoney, getOrderTotal, getPromoDiscount } from './state/totals.js'
import { useOrder } from './state/useOrder.js'
import { isStepValid } from './state/validation.js'
import { TravelersStep } from './steps/travelers/TravelersStep.jsx'

function App() {
  const { order, setOrder } = useOrder()
  const [attempted, setAttempted] = useState(false)
  const [promoView, setPromoView] = useState('link')
  const [closedGroups, setClosedGroups] = useState({})
  const summary = getSummaryTree(order)
  const promo = order.promo.appliedCode ? findPromo(order.promo.appliedCode) : null
  const view = promo ? 'applied' : promoView

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
      title="Kick off your order"
      currentStep={1}
      nextEnabled={isStepValid(order, 1)}
      onNext={() => setAttempted(true)}
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
                onToggle={() => {
                  setClosedGroups((current) => ({
                    ...current,
                    [group.id]: !current[group.id],
                  }))
                }}
              >
                {group.children.map((child) => (
                  <SummaryRow key={child.id} level="2" label={child.label} price={child.price} />
                ))}
              </SummaryGroup>
            ) : (
              <SummaryRow key={group.id} level="1" label={group.label} price={group.price} />
            ),
          )}
        </SummarySidebar>
      }
    >
      <TravelersStep attempted={attempted} />
    </CheckoutLayout>
  )
}

export default App

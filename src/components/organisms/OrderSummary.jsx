import { Divider } from '../atoms/Divider.jsx'
import { TextLink } from '../atoms/TextLink.jsx'
import { PromoApplied } from '../molecules/PromoApplied.jsx'
import { PromoForm } from '../molecules/PromoForm.jsx'
import { TotalRow } from '../molecules/TotalRow.jsx'
import './OrderSummary.css'

export function OrderSummary({
  total = '$0.00',
  promoView = 'link',
  promoValue = '',
  promoError = '',
  promoLabel,
  promoDiscount,
  onPromoOpen,
  onPromoChange,
  onPromoApply,
  onPromoCancel,
  onPromoRemove,
  children,
  className = '',
}) {
  return (
    <section className={['order-summary', className].filter(Boolean).join(' ')}>
      <h2 className="order-summary__title">Order summary</h2>
      <div className="order-summary__rows">{children}</div>
      <Divider />
      <TotalRow amount={total} />
      <Divider />
      {promoView === 'link' ? (
        <TextLink label="I have a promo" onClick={onPromoOpen} />
      ) : null}
      {promoView === 'form' || promoView === 'error' ? (
        <PromoForm
          value={promoValue}
          errorMessage={promoView === 'error' ? promoError : ''}
          onChange={onPromoChange}
          onApply={onPromoApply}
          onCancel={onPromoCancel}
        />
      ) : null}
      {promoView === 'applied' ? (
        <PromoApplied label={promoLabel} discount={promoDiscount} onRemove={onPromoRemove} />
      ) : null}
    </section>
  )
}

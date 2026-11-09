import { Divider } from '../atoms/Divider.jsx'
import { TotalRow } from '../molecules/TotalRow.jsx'
import './OrderSummary.css'

export function OrderSummary({ total = '$0.00', children, className = '' }) {
  return (
    <section className={['order-summary', className].filter(Boolean).join(' ')}>
      <h2 className="order-summary__title">Order summary</h2>
      <div className="order-summary__rows">
        {children}
      </div>
      <Divider />
      <TotalRow amount={total} />
    </section>
  )
}

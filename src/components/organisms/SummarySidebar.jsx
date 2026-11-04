import { AssuranceItem } from '../molecules/AssuranceItem.jsx'
import { OrderSummary } from './OrderSummary.jsx'
import './SummarySidebar.css'

export function SummarySidebar({ className = '', ...summaryProps }) {
  return (
    <aside className={['summary-sidebar', className].filter(Boolean).join(' ')}>
      <OrderSummary {...summaryProps} />
      <div className="summary-sidebar__assurances">
        <AssuranceItem icon="verified-shield" label="Safe & Secure Payment" />
        <AssuranceItem icon="money-back" label="14 Day Money Back Guarantee" />
      </div>
    </aside>
  )
}

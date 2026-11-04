import './TotalRow.css'

export function TotalRow({ label = 'Order total:', amount, className = '' }) {
  return (
    <div className={['total-row', className].filter(Boolean).join(' ')}>
      <span className="total-row__label">{label}</span>
      <span className="total-row__amount">{amount}</span>
    </div>
  )
}

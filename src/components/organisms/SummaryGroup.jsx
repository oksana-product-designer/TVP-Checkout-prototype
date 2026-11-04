import { SummaryRow } from '../molecules/SummaryRow.jsx'
import './SummaryGroup.css'

export function SummaryGroup({
  level = '1',
  open = false,
  label,
  price,
  showPrice = true,
  onToggle,
  children,
  className = '',
}) {
  return (
    <div className={['summary-group', `summary-group--level-${level}`, className].filter(Boolean).join(' ')}>
      <SummaryRow
        level={level}
        chevron={open ? 'Open' : 'Closed'}
        label={label}
        price={price}
        showPrice={showPrice}
        onClick={onToggle}
      />
      {open ? <div className="summary-group__children">{children}</div> : null}
    </div>
  )
}

import { ChevronToggle } from '../atoms/ChevronToggle.jsx'
import './SummaryRow.css'

export function SummaryRow({
  level = '1',
  chevron = 'None',
  label,
  price,
  showPrice = true,
  showChevron = true,
  className = '',
  onClick,
}) {
  const interactive = chevron !== 'None'
  const Tag = interactive ? 'button' : 'div'
  const classes = [
    'summary-row',
    `summary-row--level-${level}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag
      type={interactive ? 'button' : undefined}
      className={classes}
      aria-expanded={interactive ? chevron === 'Open' : undefined}
      onClick={interactive ? onClick : undefined}
    >
      <span className="summary-row__chevron">
        {showChevron && chevron !== 'None' ? (
          <ChevronToggle state={chevron === 'Open' ? 'Open' : 'Closed'} />
        ) : null}
      </span>
      <span className="summary-row__label">{label}</span>
      {showPrice ? <span className="summary-row__price">{price}</span> : null}
    </Tag>
  )
}

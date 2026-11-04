import { Icon } from '../../assets/icons/Icons.jsx'
import './AccordionHeader.css'

export function AccordionHeader({
  state = 'Open',
  title,
  badge,
  className = '',
  onClick,
  controls,
}) {
  const open = state === 'Open'

  return (
    <button
      type="button"
      className={['accordion-header', className].filter(Boolean).join(' ')}
      aria-expanded={open}
      aria-controls={controls}
      onClick={onClick}
    >
      <Icon name={open ? 'chevron-up' : 'chevron-down'} size={20} />
      <span className="accordion-header__title">{title}</span>
      {badge ? <span className="accordion-header__badge">{badge}</span> : null}
    </button>
  )
}

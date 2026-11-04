import { Icon } from '../../assets/icons/Icons.jsx'
import './ChevronToggle.css'

export function ChevronToggle({ state = 'Open', className = '' }) {
  const open = state === 'Open'

  return (
    <span
      className={['chevron-toggle', className].filter(Boolean).join(' ')}
      data-state={open ? 'open' : 'closed'}
      aria-hidden="true"
    >
      <Icon name={open ? 'chevron-up' : 'chevron-down'} />
    </span>
  )
}

import moneyBack from '../../assets/icons/money-back.svg'
import verifiedShield from '../../assets/icons/verified-shield.svg'
import { Icon } from '../../assets/icons/Icons.jsx'
import './AssuranceItem.css'

const ICONS = {
  'verified-shield': verifiedShield,
  'money-back': moneyBack,
}

export function AssuranceItem({ label, icon, className = '' }) {
  const src = typeof icon === 'string' ? ICONS[icon] : null

  return (
    <div className={['assurance-item', className].filter(Boolean).join(' ')}>
      <span className="assurance-item__icon" aria-hidden="true">
        {src ? (
          <img src={src} alt="" width="20" height="20" />
        ) : typeof icon === 'string' ? (
          <Icon name={icon} size={20} />
        ) : (
          icon
        )}
      </span>
      <span className="assurance-item__label">{label}</span>
    </div>
  )
}

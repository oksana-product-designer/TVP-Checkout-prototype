import { Icon } from '../../assets/icons/Icons.jsx'
import './FeatureItem.css'

export function FeatureItem({ label, tile = 'none', className = '' }) {
  return (
    <div className={['feature-item', className].filter(Boolean).join(' ')}>
      <span className={`feature-item__tile feature-item__tile--${tile}`} aria-hidden="true">
        <Icon name="check" size={12} />
      </span>
      <span className="feature-item__label">{label}</span>
    </div>
  )
}

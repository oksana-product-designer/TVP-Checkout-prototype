import { Icon } from '../../assets/icons/Icons.jsx'
import { TextLink } from '../atoms/TextLink.jsx'
import './PromoApplied.css'

export function PromoApplied({
  label = 'Promo SUMMER10 (10% off)',
  discount,
  onRemove,
  className = '',
}) {
  return (
    <div className={['promo-applied', className].filter(Boolean).join(' ')}>
      <div className="promo-applied__row">
        <Icon name="tag" className="promo-applied__icon" />
        <span className="promo-applied__label">{label}</span>
        <span className="promo-applied__discount">{discount}</span>
      </div>
      <TextLink label="Remove" onClick={onRemove} />
    </div>
  )
}

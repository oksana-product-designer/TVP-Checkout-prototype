import award from '../../assets/icons/award.svg'
import './TrustBadge.css'

export function TrustBadge({
  label = 'Trusted by over 1 million customers for 20 years',
  icon,
  className = '',
}) {
  return (
    <div className={['trust-badge', className].filter(Boolean).join(' ')}>
      <span className="trust-badge__icon">
        {icon || <img src={award} alt="" width="16" height="16" />}
      </span>
      <span className="trust-badge__label">{label}</span>
    </div>
  )
}

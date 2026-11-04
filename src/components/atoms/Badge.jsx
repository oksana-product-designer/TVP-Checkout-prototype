import { Icon } from '../../assets/icons/Icons.jsx'
import './Badge.css'

export function Badge({ type = 'Error', label, showIcon = true, className = '' }) {
  const classes = [
    'badge',
    type === 'Success' ? 'badge--success' : 'badge--error',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes}>
      {showIcon ? (
        <Icon
          name={type === 'Success' ? 'check' : 'circle-alert'}
          className="badge__icon"
        />
      ) : null}
      <span className="badge__label">{label}</span>
    </span>
  )
}

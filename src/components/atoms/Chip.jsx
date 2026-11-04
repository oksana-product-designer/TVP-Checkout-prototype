import { Icon } from '../../assets/icons/Icons.jsx'
import './Chip.css'

export function Chip({
  type = 'Removable',
  label,
  disabled = false,
  className = '',
  onRemove,
  ...rest
}) {
  const classes = [
    'chip',
    type === 'Removable' ? 'chip--removable' : 'chip--static',
    disabled ? 'chip--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} {...rest}>
      <span className="chip__label">{label}</span>
      {type === 'Removable' ? (
        <button
          type="button"
          className="chip__remove"
          aria-label={`Remove ${label}`}
          disabled={disabled}
          onClick={onRemove}
        >
          <Icon name="x" size={14} />
        </button>
      ) : null}
    </span>
  )
}

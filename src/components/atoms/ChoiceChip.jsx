import { Icon } from '../../assets/icons/Icons.jsx'
import './ChoiceChip.css'

export function ChoiceChip({
  label,
  selected = false,
  disabled = false,
  className = '',
  onClick,
}) {
  const classes = [
    'choice-chip',
    selected ? 'choice-chip--filled' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button
      type="button"
      className={classes}
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="choice-chip__icon">
        <Icon name={selected ? 'check' : 'plus'} />
      </span>
      {label}
    </button>
  )
}

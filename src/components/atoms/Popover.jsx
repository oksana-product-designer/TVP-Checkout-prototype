import { Icon } from '../../assets/icons/Icons.jsx'
import './Popover.css'

export function Popover({ label, text = '', id, className = '' }) {
  const classes = ['popover', className].filter(Boolean).join(' ')

  return (
    <span className={classes}>
      <button
        type="button"
        className="popover__trigger"
        aria-label={label}
        aria-describedby={text ? id : undefined}
      >
        <Icon name="info" className="popover__icon" />
      </button>
      {text ? (
        <span id={id} role="tooltip" className="popover__panel">
          {text}
        </span>
      ) : null}
    </span>
  )
}

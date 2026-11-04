import { Icon } from '../../assets/icons/Icons.jsx'
import './ButtonGroupItem.css'

export function ButtonGroupItem({
  content = 'Text',
  label,
  selected = false,
  disabled = false,
  showLeadingIcon = false,
  showTrailingIcon = false,
  leadingIcon,
  trailingIcon,
  logo,
  value,
  name,
  className = '',
  onClick,
  ...rest
}) {
  const classes = [
    'button-group-item',
    content === 'Logo' ? 'button-group-item--logo' : 'button-group-item--text',
    selected ? 'button-group-item--selected' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      role="radio"
      className={classes}
      aria-checked={selected}
      disabled={disabled}
      name={name}
      value={value}
      onClick={onClick}
      {...rest}
    >
      {content === 'Logo' ? (
        <span className="button-group-item__logo">{logo}</span>
      ) : (
        <>
          {showLeadingIcon && leadingIcon ? (
            <span className="button-group-item__icon" aria-hidden="true">
              {typeof leadingIcon === 'string' ? <Icon name={leadingIcon} /> : leadingIcon}
            </span>
          ) : null}
          <span className="button-group-item__label">{label}</span>
          {showTrailingIcon && trailingIcon ? (
            <span className="button-group-item__icon" aria-hidden="true">
              {typeof trailingIcon === 'string' ? <Icon name={trailingIcon} /> : trailingIcon}
            </span>
          ) : null}
        </>
      )}
    </button>
  )
}

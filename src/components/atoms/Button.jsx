import { Icon } from '../../assets/icons/Icons.jsx'
import './Button.css'

const TYPE_CLASS = {
  Primary: 'button--primary',
  Secondary: 'button--secondary',
  Link: 'button--link',
  'Link accent': 'button--link-accent',
  'Link danger': 'button--link-danger',
}

export function Button({
  type = 'Primary',
  size = 'Default',
  label,
  leadingIcon,
  trailingIcon,
  showLeadingIcon = false,
  showTrailingIcon = false,
  disabled = false,
  ariaDisabled = false,
  className = '',
  onClick,
  htmlType = 'button',
  ...rest
}) {
  const isLink = type === 'Link' || type === 'Link accent' || type === 'Link danger'
  const sizeClass = isLink
    ? 'button--link-size'
    : size === 'Small'
      ? 'button--small-size'
      : 'button--control-size'
  const classes = [
    'button',
    TYPE_CLASS[type] || TYPE_CLASS.Primary,
    sizeClass,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={htmlType}
      className={classes}
      disabled={disabled}
      aria-disabled={ariaDisabled || undefined}
      onClick={onClick}
      {...rest}
    >
      {showLeadingIcon && leadingIcon ? (
        <span className="button__icon" aria-hidden="true">
          {typeof leadingIcon === 'string' ? <Icon name={leadingIcon} /> : leadingIcon}
        </span>
      ) : null}
      <span className="button__label">{label}</span>
      {showTrailingIcon && trailingIcon ? (
        <span className="button__icon" aria-hidden="true">
          {typeof trailingIcon === 'string' ? <Icon name={trailingIcon} /> : trailingIcon}
        </span>
      ) : null}
    </button>
  )
}

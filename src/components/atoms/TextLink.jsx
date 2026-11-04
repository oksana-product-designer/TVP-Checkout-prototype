import './TextLink.css'

export function TextLink({
  label,
  href,
  disabled = false,
  className = '',
  onClick,
  ...rest
}) {
  const classes = ['text-link', className].filter(Boolean).join(' ')

  if (href && !disabled) {
    return (
      <a className={classes} href={href} onClick={onClick} {...rest}>
        {label}
      </a>
    )
  }

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {label}
    </button>
  )
}

import { useId } from 'react'
import { Icon } from '../../assets/icons/Icons.jsx'
import { Popover } from './Popover.jsx'
import './Checkbox.css'

export function Checkbox({
  checked = false,
  label,
  showLabel = true,
  description,
  showDescription = false,
  title,
  showTitle = false,
  titleRequired = false,
  titleInfoIcon = false,
  infoText = '',
  infoLabel = '',
  errorMessage,
  disabled = false,
  className = '',
  id,
  onChange,
  ...rest
}) {
  const generatedId = useId()
  const inputId = id || generatedId
  const errorId = `${inputId}-error`
  const descriptionId = `${inputId}-description`
  const hasError = Boolean(errorMessage)
  const describedBy = [
    showDescription && description ? descriptionId : null,
    hasError ? errorId : null,
  ]
    .filter(Boolean)
    .join(' ')

  const classes = [
    'checkbox',
    hasError ? 'checkbox--error' : '',
    disabled ? 'checkbox--disabled' : '',
    showDescription ? 'checkbox--with-description' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      {showTitle && title ? (
        <div className="checkbox__title-row">
          <div className="checkbox__title-group">
            <span className="checkbox__title">{title}</span>
            {titleRequired ? (
              <span className="checkbox__required" aria-hidden="true">
                *
              </span>
            ) : null}
          </div>
          {titleInfoIcon ? (
            <Icon name="info" className="checkbox__info" />
          ) : null}
        </div>
      ) : null}

      <div className="checkbox__row">
        <span className="checkbox__focus-area">
          <input
            id={inputId}
            className="checkbox__input"
            type="checkbox"
            checked={checked}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy || undefined}
            onChange={onChange}
            {...rest}
          />
          <span className="checkbox__box" aria-hidden="true">
            {checked ? <Icon name="check" className="checkbox__check" /> : null}
          </span>
        </span>

        {showLabel && label ? (
          <label className="checkbox__label" htmlFor={inputId}>
            {label}
          </label>
        ) : null}
        {infoText ? (
          <Popover
            label={infoLabel || (label ? `About ${label}` : 'More information')}
            text={infoText}
            id={`${inputId}-info`}
          />
        ) : null}
      </div>

      {showDescription && description ? (
        <p id={descriptionId} className="checkbox__description">
          {description}
        </p>
      ) : null}

      {hasError ? (
        <p id={errorId} className="checkbox__error" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}

import { useEffect, useId, useRef, useState } from 'react'
import { Icon } from '../../assets/icons/Icons.jsx'
import { Chip } from './Chip.jsx'
import { Popover } from './Popover.jsx'
import './InputField.css'

function FieldControl({
  type,
  inputId,
  name,
  value,
  placeholder,
  disabled,
  required,
  describedBy,
  invalid,
  onChange,
  onBlur,
  onFocus,
  onClick,
  autoComplete,
  options,
  chips,
  onRemoveChip,
  expanded,
  controls,
  queryValue,
  onQueryChange,
  activeDescendant,
  inputRef,
  suggesting = false,
}) {
  if (type === 'Select' || type === 'Multi-select') {
    const selected = Array.isArray(chips) ? chips : []
    const selectedOption = (options || []).find((option) => (option.id || option.value) === value)
    const query = (
      <input
        ref={inputRef}
        id={inputId}
        className="input-field__control input-field__query"
        type="text"
        role="combobox"
        name={name}
        value={queryValue}
        placeholder={
          type === 'Multi-select'
            ? selected.length === 0
              ? placeholder || 'Select'
              : ''
            : selectedOption
              ? ''
              : placeholder || 'Select'
        }
        disabled={disabled}
        required={required}
        autoComplete="off"
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        aria-autocomplete="list"
        aria-expanded={expanded}
        aria-controls={controls}
        aria-activedescendant={activeDescendant}
        onChange={onQueryChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
    )

    return (
      <>
        {type === 'Multi-select' ? (
          <div className="input-field__chips">
            {selected.map((chip) => (
              <Chip
                key={chip.id || chip.label}
                type="Removable"
                label={chip.label}
                disabled={disabled}
                onRemove={() => onRemoveChip?.(chip)}
              />
            ))}
            {query}
          </div>
        ) : (
          query
        )}
        <Icon name="chevron-down" className="input-field__trailing-icon" />
      </>
    )
  }

  if (type === 'Date') {
    return (
      <>
        <input
          id={inputId}
          className="input-field__control"
          type="text"
          name={name}
          value={value}
          placeholder={placeholder || 'DD/MM/YYYY'}
          disabled={disabled}
          required={required}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          onClick={onClick}
          autoComplete="off"
        />
        <Icon name="calendar" className="input-field__trailing-icon" />
      </>
    )
  }

  return (
    <input
      id={inputId}
      className="input-field__control"
      type="text"
      name={name}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      autoComplete={suggesting ? 'off' : autoComplete}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      role={suggesting ? 'combobox' : undefined}
      aria-autocomplete={suggesting ? 'list' : undefined}
      aria-expanded={suggesting ? expanded : undefined}
      aria-controls={suggesting ? controls : undefined}
      aria-activedescendant={suggesting ? activeDescendant : undefined}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  )
}

export function InputField({
  type = 'Text',
  label,
  required = false,
  infoIcon = false,
  infoText = '',
  value = '',
  placeholder,
  helperText,
  showHelperText = false,
  errorMessage,
  successMessage,
  disabled = false,
  success = false,
  className = '',
  id,
  name,
  options,
  chips,
  onChange,
  onBlur,
  onFocus,
  onClick,
  onRemoveChip,
  onToggleOption,
  onSelectOption,
  trailingIcon,
  autoComplete,
  ...rest
}) {
  const generatedId = useId()
  const inputId = id || generatedId
  const listId = `${inputId}-listbox`
  const rootRef = useRef(null)
  const inputRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [filtering, setFiltering] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const optionList = options || []
  const isMulti = type === 'Multi-select'
  const isList = type === 'Select' || isMulti
  const suggests = type === 'Text' && optionList.length > 0
  const helperId = `${inputId}-helper`
  const errorId = `${inputId}-error`
  const infoId = `${inputId}-info`
  const successId = `${inputId}-success`

  const hasError = Boolean(errorMessage)
  const hasSuccess = Boolean(success || successMessage) && !hasError && !disabled
  const filled =
    type === 'Multi-select'
      ? Array.isArray(chips) && chips.length > 0
      : Boolean(value)

  const describedBy = [
    showHelperText && helperText ? helperId : null,
    hasError ? errorId : null,
    hasSuccess && successMessage ? successId : null,
  ]
    .filter(Boolean)
    .join(' ')

  useEffect(() => {
    if (!open) return undefined

    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false)
        setQuery('')
        setFiltering(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  const filterText = (isMulti || filtering ? query : '').trim().toLowerCase()
  const suggestionQuery = suggests ? String(value).trim().toLowerCase() : ''
  const visibleOptions = isList
    ? filterText
      ? optionList.filter((option) => option.label.toLowerCase().includes(filterText))
      : optionList
    : suggests && suggestionQuery
      ? optionList
          .filter((option) => (option.city || option.label).toLowerCase().startsWith(suggestionQuery))
          .sort((left, right) => left.label.localeCompare(right.label))
          .slice(0, 8)
      : []
  const selectedOption = optionList.find((option) => optionIdOf(option) === value)
  const queryValue = isMulti || filtering ? query : selectedOption?.label || ''

  function optionIdOf(option) {
    return option.id || option.value
  }

  function isOptionSelected(option) {
    const optionId = optionIdOf(option)
    if (isMulti) return (chips || []).some((chip) => (chip.id || chip.label) === optionId)
    return optionId === value
  }

  function closeList() {
    setOpen(false)
    setQuery('')
    setFiltering(false)
  }

  function chooseOption(option) {
    if (!option) return
    if (suggests) {
      if (onSelectOption) onSelectOption(option)
      else onChange?.({ target: { value: option.city || option.label } })
      closeList()
      return
    }
    if (isMulti) {
      onToggleOption?.(option)
      setQuery('')
      setFiltering(false)
      setActiveIndex(0)
      return
    }
    onChange?.({ target: { value: optionIdOf(option) } })
    closeList()
  }

  function onQueryFocus(event) {
    if (disabled) return
    setOpen(true)
    if (!isMulti) {
      const selectAll = () => event.target.select()
      event.target.addEventListener('mouseup', selectAll, { once: true })
      requestAnimationFrame(selectAll)
    }
    if (!filtering) {
      const index = optionList.findIndex((option) => isOptionSelected(option))
      setActiveIndex(index >= 0 ? index : 0)
    }
    onFocus?.(event)
  }

  function onQueryChange(event) {
    let next = event.target.value
    if (!isMulti && !filtering) {
      const label = selectedOption?.label || ''
      if (label && next.startsWith(label)) next = next.slice(label.length)
      else if (label && next.endsWith(label)) next = next.slice(0, -label.length)
    }
    setQuery(next)
    setFiltering(true)
    setOpen(true)
    setActiveIndex(0)
  }

  function onListKeyDown(event) {
    if (!(isList || suggests) || disabled) return
    const count = visibleOptions.length

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      if (!count) return
      setActiveIndex((index) => (open ? (index + 1) % count : 0))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
      if (!count) return
      setActiveIndex((index) => (open ? (index - 1 + count) % count : count - 1))
    } else if (event.key === 'Escape') {
      event.preventDefault()
      closeList()
    } else if (event.key === 'Enter' && open && visibleOptions[activeIndex]) {
      event.preventDefault()
      chooseOption(visibleOptions[activeIndex])
    }
  }

  useEffect(() => {
    if (!open) return
    rootRef.current?.querySelector('.input-field__option--active')?.scrollIntoView({ block: 'nearest' })
  }, [open, activeIndex])

  const classes = [
    'input-field',
    `input-field--${type.toLowerCase().replace(' ', '-')}`,
    filled ? 'input-field--filled' : '',
    hasError ? 'input-field--error' : '',
    hasSuccess ? 'input-field--success' : '',
    disabled ? 'input-field--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} ref={rootRef} onKeyDown={isList || suggests ? onListKeyDown : undefined} {...rest}>
      <div className="input-field__label-row">
        <label className="input-field__label-group" htmlFor={inputId}>
          <span className="input-field__label">{label}</span>
          {required ? (
            <span className="input-field__required" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
        {infoIcon ? <Popover label={`About ${label}`} text={infoText} id={infoId} /> : null}
      </div>

      <div
        className="input-field__box"
        onMouseDown={
          isList
            ? (event) => {
                if (disabled) return
                if (event.target.closest('.chip, .input-field__option, .input-field__query')) return
                if (open) {
                  event.preventDefault()
                  closeList()
                } else inputRef.current?.focus()
              }
            : undefined
        }
      >
        <FieldControl
          type={type}
          inputId={inputId}
          name={name}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          describedBy={describedBy || undefined}
          invalid={hasError}
          onChange={
            suggests
              ? (event) => {
                  onChange?.(event)
                  setOpen(true)
                  setActiveIndex(0)
                }
              : onChange
          }
          onBlur={
            suggests
              ? (event) => {
                  setOpen(false)
                  onBlur?.(event)
                }
              : onBlur
          }
          onFocus={
            isList
              ? onQueryFocus
              : (event) => {
                  if (suggests && String(value).trim()) {
                    setOpen(true)
                    setActiveIndex(0)
                  }
                  onFocus?.(event)
                }
          }
          onClick={onClick}
          autoComplete={autoComplete}
          expanded={isList || suggests ? open && (isList || visibleOptions.length > 0) : undefined}
          controls={isList || suggests ? listId : undefined}
          options={options}
          chips={chips}
          onRemoveChip={onRemoveChip}
          queryValue={queryValue}
          onQueryChange={onQueryChange}
          activeDescendant={
            open && visibleOptions[activeIndex]
              ? `${listId}-option-${optionIdOf(visibleOptions[activeIndex])}`
              : undefined
          }
          inputRef={inputRef}
          suggesting={suggests}
        />
        {!isList && !hasSuccess && trailingIcon ? (
          <Icon name={trailingIcon} className="input-field__trailing-icon" />
        ) : null}
        {hasSuccess ? (
          <Icon name="check" className="input-field__success-icon" />
        ) : null}
        {(isList || suggests) && open && !disabled && (isList || visibleOptions.length > 0) ? (
          <ul
            id={listId}
            className="input-field__listbox"
            role="listbox"
            aria-multiselectable={isMulti || undefined}
          >
            {visibleOptions.length === 0 ? (
              <li className="input-field__empty">No matches</li>
            ) : (
              visibleOptions.map((option, index) => {
                const optionId = optionIdOf(option)
                const selected = isOptionSelected(option)
                const optionClass = [
                  'input-field__option',
                  selected ? 'input-field__option--selected' : '',
                  index === activeIndex ? 'input-field__option--active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')

                return (
                  <li key={optionId} role="presentation">
                    <button
                      type="button"
                      id={`${listId}-option-${optionId}`}
                      role="option"
                      className={optionClass}
                      aria-selected={selected}
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => chooseOption(option)}
                    >
                      {selected ? <Icon name="check" /> : <span className="input-field__option-mark" aria-hidden="true" />}
                      {option.label}
                    </button>
                  </li>
                )
              })
            )}
          </ul>
        ) : null}
      </div>

      {showHelperText && helperText && !hasError && !hasSuccess ? (
        <p id={helperId} className="input-field__helper">
          {helperText}
        </p>
      ) : null}

      {hasError ? (
        <p id={errorId} className="input-field__error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {hasSuccess && successMessage ? (
        <p id={successId} className="input-field__success">
          {successMessage}
        </p>
      ) : null}
    </div>
  )
}

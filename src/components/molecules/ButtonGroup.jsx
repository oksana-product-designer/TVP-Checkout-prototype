import { Children, cloneElement, isValidElement, useId } from 'react'
import './ButtonGroup.css'

export function ButtonGroup({
  children,
  value,
  onChange,
  name,
  label,
  className = '',
}) {
  const groupId = useId()
  const items = Children.toArray(children).filter(isValidElement)
  const enabled = items.filter((child) => !child.props.disabled)
  const selectedIndex = enabled.findIndex((child) => child.props.value === value)
  const tabbableValue = enabled[selectedIndex >= 0 ? selectedIndex : 0]?.props.value

  function onKeyDown(event) {
    const key = event.key
    if (key !== 'ArrowRight' && key !== 'ArrowDown' && key !== 'ArrowLeft' && key !== 'ArrowUp') return
    if (event.target.getAttribute('role') !== 'radio') return
    if (!enabled.length) return

    event.preventDefault()
    const values = enabled.map((child) => child.props.value)
    const index = Math.max(0, values.indexOf(value))
    const delta = key === 'ArrowRight' || key === 'ArrowDown' ? 1 : -1
    const nextValue = values[(index + delta + values.length) % values.length]
    onChange?.(nextValue, event)
    requestAnimationFrame(() => {
      document.getElementById(`${groupId}-${nextValue}`)?.focus()
    })
  }

  return (
    <div
      className={['button-group', className].filter(Boolean).join(' ')}
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      {items.map((child) => {
        const childValue = child.props.value
        const selected = value !== undefined ? childValue === value : child.props.selected

        return cloneElement(child, {
          name,
          id: `${groupId}-${childValue}`,
          selected,
          tabIndex: childValue === tabbableValue ? 0 : -1,
          onClick: (event) => {
            child.props.onClick?.(event)
            if (!child.props.disabled) onChange?.(childValue, event)
          },
        })
      })}
    </div>
  )
}

import { Children, cloneElement, isValidElement } from 'react'
import './ButtonGroup.css'

export function ButtonGroup({
  children,
  value,
  onChange,
  name,
  label,
  className = '',
}) {
  return (
    <div
      className={['button-group', className].filter(Boolean).join(' ')}
      role="radiogroup"
      aria-label={label}
    >
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return child

        const childValue = child.props.value
        const selected =
          value !== undefined ? childValue === value : child.props.selected

        return cloneElement(child, {
          name,
          selected,
          onClick: (event) => {
            child.props.onClick?.(event)
            if (!child.props.disabled) onChange?.(childValue, event)
          },
        })
      })}
    </div>
  )
}

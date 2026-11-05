import { useEffect, useRef, useState } from 'react'
import { Icon } from '../../assets/icons/Icons.jsx'
import './Popover.css'

export function Popover({ label, text = '', id, className = '' }) {
  const rootRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const visible = Boolean(text) && open && !dismissed

  useEffect(() => {
    if (!visible) return undefined

    function onKeyDown(event) {
      if (event.key !== 'Escape') return
      setDismissed(true)
      setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [visible])

  function show() {
    if (!dismissed) setOpen(true)
  }

  function hide() {
    setDismissed(false)
    setOpen(false)
  }

  function hideFromPointer() {
    if (rootRef.current?.contains(document.activeElement)) return
    hide()
  }

  const classes = ['popover', visible ? 'popover--open' : '', className].filter(Boolean).join(' ')

  return (
    <span ref={rootRef} className={classes} onMouseEnter={show} onMouseLeave={hideFromPointer}>
      <button
        type="button"
        className="popover__trigger"
        aria-label={label}
        aria-describedby={text ? id : undefined}
        aria-expanded={text ? visible : undefined}
        onFocus={show}
        onBlur={hide}
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

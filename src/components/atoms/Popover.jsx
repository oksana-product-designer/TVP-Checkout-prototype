import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Icon } from '../../assets/icons/Icons.jsx'
import './Popover.css'

export function Popover({ label, text = '', id, className = '' }) {
  const rootRef = useRef(null)
  const panelRef = useRef(null)
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

  useLayoutEffect(() => {
    const panel = panelRef.current
    if (!visible || !panel || typeof window.matchMedia !== 'function') return undefined
    const media = window.matchMedia('(max-width: 639px)')
    const edge = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--space-16'),
    ) || 16

    function place() {
      panel.style.maxWidth = ''
      panel.style.transform = ''
      if (!media.matches) return
      panel.style.maxWidth = `calc(100vw - ${edge * 2}px)`
      const rect = panel.getBoundingClientRect()
      const shift = Math.max(0, edge - rect.left)
      if (shift) panel.style.transform = `translateX(${shift}px)`
    }

    place()
    media.addEventListener('change', place)
    window.addEventListener('resize', place)
    return () => {
      media.removeEventListener('change', place)
      window.removeEventListener('resize', place)
      panel.style.maxWidth = ''
      panel.style.transform = ''
    }
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
        <span ref={panelRef} id={id} role="tooltip" className="popover__panel">
          {text}
        </span>
      ) : null}
    </span>
  )
}

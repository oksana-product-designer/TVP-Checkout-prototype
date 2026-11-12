import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { Icon } from '../../assets/icons/Icons.jsx'
import { Button } from '../atoms/Button.jsx'
import { OrderSummary } from './OrderSummary.jsx'
import { SummaryContents } from './SummaryContents.jsx'
import './MobileTotalBar.css'

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function prefersReducedMotion() {
  return typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function focusableItems(root) {
  if (!root) return []
  return [...root.querySelectorAll(FOCUSABLE)]
}

export function MobileTotalBar({
  total,
  summary,
  nextEnabled = false,
  nextLabel = 'Next step',
  onNext,
}) {
  const titleId = useId()
  const sheetId = useId()
  const barRef = useRef(null)
  const triggerRef = useRef(null)
  const sheetRef = useRef(null)
  const frameRef = useRef(0)
  const closeTimerRef = useRef(0)
  const [open, setOpen] = useState(false)
  const [rendered, setRendered] = useState(false)
  const [shown, setShown] = useState(false)
  const [openGroups, setOpenGroups] = useState({})
  const actionLabel = open ? 'Hide order summary' : 'View order summary'

  function openSheet() {
    window.clearTimeout(closeTimerRef.current)
    const next = {}
    summary.forEach((group) => {
      if (group.children?.length) next[group.id] = true
    })
    setOpenGroups(next)
    setRendered(true)
    setOpen(true)
    if (prefersReducedMotion()) setShown(true)
  }

  function closeSheet() {
    window.cancelAnimationFrame(frameRef.current)
    setOpen(false)
    setShown(false)
    const delay = prefersReducedMotion() ? 0 : 200
    closeTimerRef.current = window.setTimeout(() => setRendered(false), delay)
  }

  useLayoutEffect(() => {
    const bar = barRef.current
    if (!bar) return undefined

    function apply() {
      document.documentElement.style.setProperty('--mobile-total-bar-height', `${bar.offsetHeight}px`)
    }

    apply()
    if (typeof ResizeObserver !== 'function') {
      return () => {
        document.documentElement.style.setProperty('--mobile-total-bar-height', '0px')
      }
    }
    const observer = new ResizeObserver(apply)
    observer.observe(bar)
    return () => {
      observer.disconnect()
      document.documentElement.style.setProperty('--mobile-total-bar-height', '0px')
    }
  }, [])

  useEffect(() => () => {
    window.cancelAnimationFrame(frameRef.current)
    window.clearTimeout(closeTimerRef.current)
  }, [])

  useEffect(() => {
    if (!open || prefersReducedMotion()) return undefined
    frameRef.current = requestAnimationFrame(() => setShown(true))
    return () => window.cancelAnimationFrame(frameRef.current)
  }, [open])

  useEffect(() => {
    if (!open) return undefined

    const trigger = triggerRef.current
    sheetRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeSheet()
        return
      }
      if (event.key !== 'Tab') return

      const items = focusableItems(sheetRef.current)
      if (!items.length) {
        event.preventDefault()
        return
      }

      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      const sheet = sheetRef.current
      const inside = sheet?.contains(active)

      if (!inside || (event.shiftKey && (active === first || active === sheet))) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus()
    }
  }, [open])

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined
    const media = window.matchMedia('(max-width: 639px)')

    function onChange() {
      if (!media.matches) closeSheet()
    }

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  function toggleGroup(id) {
    setOpenGroups((current) => ({
      ...current,
      [id]: !current[id],
    }))
  }

  return (
    <>
      {rendered ? (
        <button
          type="button"
          className={['mobile-summary-scrim', shown ? 'mobile-summary-scrim--shown' : ''].filter(Boolean).join(' ')}
          aria-label="Close order summary"
          tabIndex={-1}
          onClick={closeSheet}
        />
      ) : null}
      {rendered ? (
        <div
          ref={sheetRef}
          id={sheetId}
          className={['mobile-summary-sheet', shown ? 'mobile-summary-sheet--shown' : ''].filter(Boolean).join(' ')}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
        >
          <div className="mobile-summary-sheet__handle" aria-hidden="true" />
          <Button
            className="mobile-summary-sheet__close"
            type="Link"
            label="Close"
            showLeadingIcon
            leadingIcon="x"
            onClick={closeSheet}
          />
          <div className="mobile-summary-sheet__body">
            <OrderSummary className="order-summary--embedded" total={total} titleId={titleId}>
              <SummaryContents summary={summary} openGroups={openGroups} onToggle={toggleGroup} />
            </OrderSummary>
          </div>
        </div>
      ) : null}
      <div className="mobile-total-bar" ref={barRef}>
        <button
          ref={triggerRef}
          type="button"
          className="mobile-total-bar__summary"
          aria-expanded={open}
          aria-controls={sheetId}
          aria-label={`${actionLabel}, total ${total}`}
          onClick={() => (open ? closeSheet() : openSheet())}
        >
          <span className="mobile-total-bar__total">{total}</span>
          <span className="mobile-total-bar__toggle">
            {actionLabel}
            <Icon name={open ? 'chevron-down' : 'chevron-up'} />
          </span>
        </button>
        <Button
          className="mobile-total-bar__next"
          type="Primary"
          label={nextLabel}
          showTrailingIcon
          trailingIcon="arrow-right"
          ariaDisabled={!nextEnabled}
          onClick={onNext}
        />
      </div>
    </>
  )
}

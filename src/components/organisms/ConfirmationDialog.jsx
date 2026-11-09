import { useEffect, useRef } from 'react'
import { Button } from '../atoms/Button.jsx'
import './ConfirmationDialog.css'

function focusableButtons(panel) {
  if (!panel) return []
  return [...panel.querySelectorAll('button:not([disabled])')]
}

export function ConfirmationDialog({
  open = false,
  title,
  message,
  cancelLabel = 'Cancel',
  confirmLabel = 'Remove Applicant',
  onCancel,
  onConfirm,
}) {
  const panelRef = useRef(null)
  const onCancelRef = useRef(onCancel)

  useEffect(() => {
    onCancelRef.current = onCancel
  }, [onCancel])

  useEffect(() => {
    if (!open) return undefined

    const trigger = document.activeElement
    focusableButtons(panelRef.current)[0]?.focus()

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        onCancelRef.current?.()
        return
      }
      if (event.key !== 'Tab') return

      const items = focusableButtons(panelRef.current)
      if (!items.length) {
        event.preventDefault()
        return
      }

      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      const inside = panelRef.current?.contains(active)

      if (!inside || (event.shiftKey && active === first)) {
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
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus()
    }
  }, [open])

  if (!open) return null

  return (
    <div className="confirmation-dialog" role="presentation">
      <button
        type="button"
        className="confirmation-dialog__scrim"
        aria-label="Close dialog"
        tabIndex={-1}
        onClick={onCancel}
      />
      <div
        ref={panelRef}
        className="confirmation-dialog__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-message"
      >
        <h2 id="confirmation-dialog-title" className="confirmation-dialog__title">
          {title}
        </h2>
        <p id="confirmation-dialog-message" className="confirmation-dialog__message">
          {message}
        </p>
        <div className="confirmation-dialog__actions">
          <Button type="Secondary" label={cancelLabel} onClick={onCancel} />
          <Button type="Primary" label={confirmLabel} onClick={onConfirm} />
        </div>
      </div>
    </div>
  )
}

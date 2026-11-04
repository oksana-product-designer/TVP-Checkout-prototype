import { useEffect } from 'react'
import { Button } from '../atoms/Button.jsx'
import './ConfirmationDialog.css'

export function ConfirmationDialog({
  open = false,
  title,
  message,
  cancelLabel = 'Cancel',
  confirmLabel = 'Remove traveller',
  onCancel,
  onConfirm,
}) {
  useEffect(() => {
    if (!open) return undefined

    function onKeyDown(event) {
      if (event.key === 'Escape') onCancel?.()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="confirmation-dialog" role="presentation">
      <button type="button" className="confirmation-dialog__scrim" aria-label="Close dialog" onClick={onCancel} />
      <div
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

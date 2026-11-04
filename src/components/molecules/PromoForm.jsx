import { Button } from '../atoms/Button.jsx'
import { InputField } from '../atoms/InputField.jsx'
import './PromoForm.css'

export function PromoForm({
  value = '',
  errorMessage,
  onChange,
  onApply,
  onCancel,
  className = '',
}) {
  return (
    <form
      className={['promo-form', className].filter(Boolean).join(' ')}
      onSubmit={(event) => {
        event.preventDefault()
        onApply?.(value)
      }}
    >
      <InputField
        type="Text"
        label="Promo code"
        required={false}
        value={value}
        placeholder="Enter promo code"
        errorMessage={errorMessage}
        onChange={(event) => onChange?.(event.target.value)}
      />
      <div className="promo-form__actions">
        <Button type="Primary" label="Apply" htmlType="submit" />
        <Button type="Link" label="Cancel" onClick={onCancel} />
      </div>
    </form>
  )
}

import { InputField } from './InputField.jsx'
import './InputFieldV2.css'

/** Updated date-field design. Retains InputField's props and event contract. */
export function InputFieldV2({ type = 'Date', placeholder, className = '', ...props }) {
  return (
    <InputField
      {...props}
      type={type}
      placeholder={placeholder ?? (type === 'Date' ? 'DD/MM/YYYY' : undefined)}
      className={['input-field--v2', className].filter(Boolean).join(' ')}
      data-design-version="2"
    />
  )
}

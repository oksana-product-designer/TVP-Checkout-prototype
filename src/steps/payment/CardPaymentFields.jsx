import { InputField } from '../../components/atoms/InputField.jsx'
import { FormRow } from '../../components/molecules/FormRow.jsx'
import { formatCardNumber, formatCvv, formatExpiration } from '../../state/validation.js'

export function CardPaymentFields({
  cardNumber,
  expiration,
  cvv,
  errors,
  onCardNumber,
  onExpiration,
  onCvv,
}) {
  return (
    <>
      <InputField
        label="Card number"
        required
        name="cardNumber"
        value={cardNumber}
        trailingIcon="credit-card"
        autoComplete="off"
        errorMessage={errors.cardNumber || ''}
        onChange={(event) => onCardNumber(formatCardNumber(event.target.value))}
      />
      <FormRow>
        <InputField
          label="Expiration date"
          required
          name="expiration"
          value={expiration}
          placeholder="MM/YY"
          autoComplete="off"
          errorMessage={errors.expiration || ''}
          onChange={(event) => onExpiration(formatExpiration(event.target.value))}
        />
        <InputField
          label="CVV"
          required
          name="cvv"
          value={cvv}
          autoComplete="off"
          errorMessage={errors.cvv || ''}
          onChange={(event) => onCvv(formatCvv(event.target.value))}
        />
      </FormRow>
      <p className="payment-step__copy">
        * By paying with my card, I agree to the Travel Visa Pro privacy policy.
      </p>
    </>
  )
}

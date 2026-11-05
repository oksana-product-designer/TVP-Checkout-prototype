import { ButtonGroup } from '../../components/molecules/ButtonGroup.jsx'
import { ButtonGroupItem } from '../../components/molecules/ButtonGroupItem.jsx'
import { Card } from '../../components/organisms/Card.jsx'
import { FormSection } from '../../components/organisms/FormSection.jsx'
import { useOrder } from '../../state/useOrder.js'
import { paymentErrors } from '../../state/validation.js'
import { CardPaymentFields } from './CardPaymentFields.jsx'
import { PAYMENT_METHODS } from './paymentMethods.js'
import { WalletPaymentPanel } from './WalletPaymentPanel.jsx'
import './PaymentStep.css'

function fieldError(attempted, value, message) {
  if (!message) return ''
  return attempted || String(value || '') ? message : ''
}

export function PaymentStep({ attempted = false }) {
  const { order, setOrder } = useOrder()
  const payment = order.payment
  const method = PAYMENT_METHODS.find((item) => item.id === payment.method) || PAYMENT_METHODS[0]
  const found = paymentErrors(order)
  const errors = {
    cardNumber: attempted ? found.cardNumber || '' : '',
    expiration: attempted ? found.expiration || '' : '',
    cvv: fieldError(attempted, payment.cvv, found.cvv),
  }

  function patchPayment(patch) {
    setOrder((current) => ({
      ...current,
      payment: { ...current.payment, ...patch },
    }))
  }

  return (
    <Card>
      <FormSection className="payment-step__methods" showHeader={false}>
        <ButtonGroup
          label="Payment method"
          name="payment-method"
          value={method.id}
          onChange={(value) => patchPayment({ method: value })}
        >
          {PAYMENT_METHODS.map((item) => (
            <ButtonGroupItem
              key={item.id}
              value={item.id}
              label={item.label}
              content={item.logo ? 'Logo' : 'Text'}
              showLeadingIcon={!item.logo}
              leadingIcon={item.logo ? undefined : 'credit-card'}
              logo={item.logo ? <img src={item.logo} alt="" /> : undefined}
            />
          ))}
        </ButtonGroup>
      </FormSection>
      <FormSection className="payment-step__details" showHeader={false} showDivider>
        {method.id === 'card' ? (
          <CardPaymentFields
            cardNumber={payment.cardNumber}
            expiration={payment.expiration}
            cvv={payment.cvv}
            errors={errors}
            onCardNumber={(cardNumber) => patchPayment({ cardNumber })}
            onExpiration={(expiration) => patchPayment({ expiration })}
            onCvv={(cvv) => patchPayment({ cvv })}
          />
        ) : (
          <WalletPaymentPanel
            logo={method.logo}
            explanation={method.explanation}
            legal={method.legal}
          />
        )}
      </FormSection>
    </Card>
  )
}

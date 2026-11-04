import googlePayLogo from '../../assets/logo-google-pay.svg'
import paypalLogo from '../../assets/logo-paypal.svg'
import paypalCreditLogo from '../../assets/logo-paypal-credit.svg'

export const PAYMENT_METHODS = [
  {
    id: 'card',
    label: 'Card',
    action: 'Place order',
  },
  {
    id: 'paypal',
    label: 'PayPal',
    logo: paypalLogo,
    explanation: 'You will be redirected to PayPal to securely complete your payment.',
    legal: '* By paying with PayPal, I agree to the PayPal Privacy Statement.',
    action: 'Continue with PayPal',
  },
  {
    id: 'paypal-credit',
    label: 'PayPal Credit',
    logo: paypalCreditLogo,
    explanation: 'You will be redirected to PayPal to pay with PayPal Credit. Subject to credit approval.',
    legal: '* By paying with PayPal Credit, I agree to the PayPal Privacy Statement.',
    action: 'Continue with PayPal Credit',
  },
  {
    id: 'google-pay',
    label: 'Google Pay',
    logo: googlePayLogo,
    explanation: 'Confirm your payment with the cards saved in your Google account in the Google Pay window.',
    legal: '* By paying with Google Pay, I agree to the Google Pay Terms of Service.',
    action: 'Pay with Google Pay',
  },
]

export function paymentActionLabel(method) {
  return PAYMENT_METHODS.find((item) => item.id === method)?.action || 'Place order'
}

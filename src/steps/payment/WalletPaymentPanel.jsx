export function WalletPaymentPanel({ logo, explanation, legal }) {
  return (
    <>
      <div className="payment-step__notice">
        <img className="payment-step__logo" src={logo} alt="" width="96" height="24" />
        <p className="payment-step__copy">{explanation}</p>
      </div>
      <p className="payment-step__copy">{legal}</p>
    </>
  )
}

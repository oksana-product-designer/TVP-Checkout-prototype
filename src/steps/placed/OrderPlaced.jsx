import orderReceived from '../../assets/order-received.svg'
import { Button } from '../../components/atoms/Button.jsx'
import { Card } from '../../components/organisms/Card.jsx'
import './OrderPlaced.css'

export function OrderPlaced({ onHome }) {
  return (
    <Card className="order-placed">
      <img className="order-placed__art" src={orderReceived} alt="" width="184" height="136" />
      <div className="order-placed__copy">
        <h2 className="order-placed__thanks">Thank you for choosing Travel Visa Pro!</h2>
        <p className="order-placed__line">We sent your order details to your email.</p>
        <p className="order-placed__line order-placed__follow-up">
          A manager will contact you within 2–3 business days to discuss your order and guide you
          through the next steps.
        </p>
      </div>
      <Button label="Start a new order" onClick={onHome} />
    </Card>
  )
}

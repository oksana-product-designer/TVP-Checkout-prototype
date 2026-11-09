import { Card } from '../../components/organisms/Card.jsx'
import affiliate from '../../mocks/affiliate.json'
import './AffiliateBanner.css'

export function AffiliateBanner() {
  return (
    <Card className="affiliate-banner">
      <img className="affiliate-banner__logo" src={affiliate.logo} alt={affiliate.name} />
      <p className="affiliate-banner__description">{affiliate.description}</p>
    </Card>
  )
}

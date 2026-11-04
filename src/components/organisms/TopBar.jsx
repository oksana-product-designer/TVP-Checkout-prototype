import logo from '../../assets/logo-tvp.svg'
import './TopBar.css'

export function TopBar() {
  return (
    <header className="top-bar">
      <img className="top-bar__logo" src={logo} alt="Travel Visa Pro" width="119" height="36" />
      <p className="top-bar__support">
        Talk to <strong>real</strong> experts <strong>24/7 @</strong> 1-833-TVP-VISA (887-8472) —no AI
      </p>
    </header>
  )
}

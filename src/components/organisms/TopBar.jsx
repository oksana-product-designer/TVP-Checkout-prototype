import logo from '../../assets/logo-tvp.svg'
import './TopBar.css'

export function TopBar() {
  return (
    <header className="top-bar">
      <img className="top-bar__logo" src={logo} alt="Travel Visa Pro" width="119" height="36" />
      <p className="top-bar__support">
        Talk to a person 24/7 at 1-833-TVP-VISA (887-8472)
      </p>
    </header>
  )
}

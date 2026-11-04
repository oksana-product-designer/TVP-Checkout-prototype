import './Divider.css'

export function Divider({ className = '' }) {
  return <hr className={['divider', className].filter(Boolean).join(' ')} />
}

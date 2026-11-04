import './SectionHeader.css'

export function SectionHeader({ title, action, className = '' }) {
  return (
    <div className={['section-header', className].filter(Boolean).join(' ')}>
      <h2 className="section-header__title">{title}</h2>
      {action ? <div className="section-header__action">{action}</div> : null}
    </div>
  )
}

import { Divider } from '../atoms/Divider.jsx'
import { SectionHeader } from '../molecules/SectionHeader.jsx'
import './FormSection.css'

export function FormSection({
  title,
  action,
  showHeader = true,
  showDivider = false,
  children,
  className = '',
}) {
  return (
    <section className={['form-section', className].filter(Boolean).join(' ')}>
      {showDivider ? (
        <div className="form-section__divider">
          <Divider />
        </div>
      ) : null}
      {showHeader && title ? <SectionHeader title={title} action={action} /> : null}
      <div className="form-section__content">{children}</div>
    </section>
  )
}

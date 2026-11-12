import { SummaryRow } from '../molecules/SummaryRow.jsx'
import { SummaryGroup } from './SummaryGroup.jsx'

function renderServiceLines(lines, openGroups, onToggle) {
  return lines.map((line) => (
    line.children?.length ? (
      <SummaryGroup
        key={line.id}
        level="2"
        label={line.label}
        price={line.price}
        open={Boolean(openGroups[line.id])}
        onToggle={() => onToggle(line.id)}
      >
        {line.children.map((child) => (
          <SummaryRow key={child.id} level="3" label={child.label} price={child.price} />
        ))}
      </SummaryGroup>
    ) : (
      <SummaryRow key={line.id} level="2" label={line.label} price={line.price} />
    )
  ))
}

export function SummaryContents({ summary, openGroups, onToggle }) {
  return summary.map((group, index) => {
    if (group.children.length > 0) {
      return (
        <SummaryGroup
          key={group.id}
          label={group.label}
          price={group.price}
          open={Boolean(openGroups[group.id])}
          onToggle={() => onToggle(group.id)}
        >
          {renderServiceLines(group.children, openGroups, onToggle)}
        </SummaryGroup>
      )
    }

    const previous = summary[index - 1]?.kind
    const afterApplicants = group.kind === 'order' && previous === 'applicant'
    const startsSection = afterApplicants || (group.kind === 'discount' && previous !== 'discount')

    return (
      <SummaryRow
        key={group.id}
        level="1"
        label={group.label}
        price={group.price}
        className={[
          afterApplicants ? 'summary-row--after-applicants' : '',
          startsSection && !afterApplicants ? 'summary-row--section-start' : '',
          group.kind === 'discount' ? 'summary-row--discount' : '',
        ].filter(Boolean).join(' ')}
      />
    )
  })
}

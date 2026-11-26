export const SERVICE_CHOICES = [
  { id: 'passport', kind: 'passport', label: 'Passport' },
  { id: 'visa', kind: 'visa', label: 'Visa' },
  { id: 'legalization', kind: 'legalization', label: 'Legalization' },
  { id: 'translation', kind: 'translation', label: 'Translation' },
]

export const MAX_SERVICES = SERVICE_CHOICES.length

export function isChoiceSelected(selections, choice) {
  return selections.some((item) => item.kind === choice.kind)
}

export function selectionsInChoiceOrder(selections) {
  return SERVICE_CHOICES
    .map((choice) => selections.find((item) => item.kind === choice.kind))
    .filter(Boolean)
}

// url=https://www.figma.com/design/4cN2sjeRxYOB0Tfjh6gRKr/TVP?node-id=87-123
// source=src/components/atoms/Button.jsx
// component=Button
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('Label')
const type = instance.getEnum('Type', {
  Primary: 'Primary',
  Secondary: 'Secondary',
  Link: 'Link',
  'Link accent': 'Link accent',
})
const state = instance.getEnum('State', {
  Default: 'Default',
  Hover: 'Hover',
  Pressed: 'Pressed',
  Focus: 'Focus',
  Disabled: 'Disabled',
})
const showLeadingIcon = instance.getBoolean('Show leading icon')
const showTrailingIcon = instance.getBoolean('Show trailing icon')
const leadingIcon = showLeadingIcon ? instance.getInstanceSwap('Leading icon') : null
const trailingIcon = showTrailingIcon ? instance.getInstanceSwap('Trailing icon') : null

let leadingIconCode
if (leadingIcon && leadingIcon.type === 'INSTANCE') {
  leadingIconCode = leadingIcon.executeTemplate().example
}

let trailingIconCode
if (trailingIcon && trailingIcon.type === 'INSTANCE') {
  trailingIconCode = trailingIcon.executeTemplate().example
}

const disabled = state === 'Disabled'

export default {
  example: figma.code`
    <Button
      type="${type}"
      label="${label}"
      ${disabled ? 'disabled' : ''}
      ${showLeadingIcon ? 'showLeadingIcon' : ''}
      ${showTrailingIcon ? 'showTrailingIcon' : ''}
      ${leadingIconCode ? figma.code`leadingIcon={${leadingIconCode}}` : ''}
      ${trailingIconCode ? figma.code`trailingIcon={${trailingIconCode}}` : ''}
    />
  `,
  imports: ["import { Button } from 'src/components/atoms/Button.jsx'"],
  id: 'button',
  metadata: { nestable: true },
}

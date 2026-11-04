// url=https://www.figma.com/design/4cN2sjeRxYOB0Tfjh6gRKr/TVP?node-id=108-264
// source=src/components/atoms/TextLink.jsx
// component=TextLink
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('Label')
const state = instance.getEnum('State', {
  Default: 'Default',
  Hover: 'Hover',
  Pressed: 'Pressed',
  Focus: 'Focus',
  Disabled: 'Disabled',
})

const disabled = state === 'Disabled'

export default {
  example: figma.code`
    <TextLink
      label="${label}"
      ${disabled ? 'disabled' : ''}
    />
  `,
  imports: ["import { TextLink } from 'src/components/atoms/TextLink.jsx'"],
  id: 'text-link',
  metadata: { nestable: true },
}

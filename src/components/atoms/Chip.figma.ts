// url=https://www.figma.com/design/4cN2sjeRxYOB0Tfjh6gRKr/TVP?node-id=204-9930
// source=src/components/atoms/Chip.jsx
// component=Chip
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('Label')
const type = instance.getEnum('Type', {
  Removable: 'Removable',
  Static: 'Static',
})
const state = instance.getEnum('State', {
  Default: 'Default',
  Hover: 'Hover',
  Disabled: 'Disabled',
})

const disabled = state === 'Disabled'

export default {
  example: figma.code`
    <Chip
      type="${type}"
      label="${label}"
      ${disabled ? 'disabled' : ''}
    />
  `,
  imports: ["import { Chip } from 'src/components/atoms/Chip.jsx'"],
  id: 'chip',
  metadata: { nestable: true },
}

// url=https://www.figma.com/design/4cN2sjeRxYOB0Tfjh6gRKr/TVP?node-id=153-3288
// source=src/components/atoms/Badge.jsx
// component=Badge
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('Label')
const showIcon = instance.getBoolean('Show icon')
const type = instance.getEnum('Type', {
  Error: 'Error',
  Success: 'Success',
})

export default {
  example: figma.code`
    <Badge
      type="${type}"
      label="${label}"
      ${showIcon ? 'showIcon' : ''}
    />
  `,
  imports: ["import { Badge } from 'src/components/atoms/Badge.jsx'"],
  id: 'badge',
  metadata: { nestable: true },
}

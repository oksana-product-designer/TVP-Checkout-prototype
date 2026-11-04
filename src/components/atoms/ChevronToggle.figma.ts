// url=https://www.figma.com/design/4cN2sjeRxYOB0Tfjh6gRKr/TVP?node-id=108-252
// source=src/components/atoms/ChevronToggle.jsx
// component=ChevronToggle
import figma from 'figma'
const instance = figma.selectedInstance

const state = instance.getEnum('State', {
  Open: 'Open',
  Closed: 'Closed',
})

export default {
  example: figma.code`
    <ChevronToggle state="${state}" />
  `,
  imports: ["import { ChevronToggle } from 'src/components/atoms/ChevronToggle.jsx'"],
  id: 'chevron-toggle',
  metadata: { nestable: true },
}

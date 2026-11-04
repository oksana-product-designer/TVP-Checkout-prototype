// url=https://www.figma.com/design/4cN2sjeRxYOB0Tfjh6gRKr/TVP?node-id=98-169
// source=src/components/atoms/StepMarker.jsx
// component=StepMarker
import figma from 'figma'
const instance = figma.selectedInstance

const number = instance.getString('Number')
const state = instance.getEnum('State', {
  Current: 'Current',
  Upcoming: 'Upcoming',
  Completed: 'Completed',
})

export default {
  example: figma.code`
    <StepMarker
      state="${state}"
      number="${number}"
    />
  `,
  imports: ["import { StepMarker } from 'src/components/atoms/StepMarker.jsx'"],
  id: 'step-marker',
  metadata: { nestable: true },
}

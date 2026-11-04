// url=https://www.figma.com/design/4cN2sjeRxYOB0Tfjh6gRKr/TVP?node-id=158-5630
// source=src/components/atoms/CalendarDay.jsx
// component=CalendarDay
import figma from 'figma'
const instance = figma.selectedInstance

const day = instance.getString('Day')
const state = instance.getEnum('State', {
  Default: 'Default',
  Hover: 'Hover',
  Today: 'Today',
  Selected: 'Selected',
  Disabled: 'Disabled',
  Outside: 'Outside',
})

export default {
  example: figma.code`
    <CalendarDay
      day="${day}"
      state="${state}"
    />
  `,
  imports: ["import { CalendarDay } from 'src/components/atoms/CalendarDay.jsx'"],
  id: 'calendar-day',
  metadata: { nestable: true },
}

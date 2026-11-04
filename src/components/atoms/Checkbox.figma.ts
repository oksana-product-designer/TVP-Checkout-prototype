// url=https://www.figma.com/design/4cN2sjeRxYOB0Tfjh6gRKr/TVP?node-id=89-157
// source=src/components/atoms/Checkbox.jsx
// component=Checkbox
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('Label')
const showLabel = instance.getBoolean('Show label')
const errorMessage = instance.getString('Error message')
const description = instance.getString('Description text')
const showTitle = instance.getBoolean('Show title')
const title = instance.getString('Title')
const titleRequired = instance.getBoolean('Title required')
const titleInfoIcon = instance.getBoolean('Title info icon')
const checked = instance.getEnum('Checked', {
  False: false,
  True: true,
})
const state = instance.getEnum('State', {
  Default: 'Default',
  Hover: 'Hover',
  Focus: 'Focus',
  Disabled: 'Disabled',
  Error: 'Error',
})
const showDescription = instance.getEnum('Description', {
  True: true,
  False: false,
})

const disabled = state === 'Disabled'
const showError = state === 'Error'

export default {
  example: figma.code`
    <Checkbox
      label="${label}"
      checked={${checked}}
      showLabel={${showLabel}}
      showDescription={${showDescription}}
      showTitle={${showTitle}}
      titleRequired={${titleRequired}}
      titleInfoIcon={${titleInfoIcon}}
      ${disabled ? 'disabled' : ''}
      ${showDescription ? figma.code`description="${description}"` : ''}
      ${showTitle ? figma.code`title="${title}"` : ''}
      ${showError ? figma.code`errorMessage="${errorMessage}"` : ''}
    />
  `,
  imports: ["import { Checkbox } from 'src/components/atoms/Checkbox.jsx'"],
  id: 'checkbox',
  metadata: { nestable: true },
}

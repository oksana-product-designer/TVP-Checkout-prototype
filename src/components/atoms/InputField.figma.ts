// url=https://www.figma.com/design/4cN2sjeRxYOB0Tfjh6gRKr/TVP?node-id=88-169
// source=src/components/atoms/InputField.jsx
// component=InputField
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('Label')
const required = instance.getBoolean('Required')
const infoIcon = instance.getBoolean('Info icon')
const value = instance.getString('Value')
const showHelperText = instance.getBoolean('Show helper text')
const helperText = instance.getString('Helper text')
const errorMessage = instance.getString('Error message')
const successMessage = instance.getString('Success message')
const type = instance.getEnum('Type', {
  Text: 'Text',
  Select: 'Select',
  Date: 'Date',
  'Multi-select': 'Multi-select',
})
const state = instance.getEnum('State', {
  Default: 'Default',
  Hover: 'Hover',
  Focus: 'Focus',
  Filled: 'Filled',
  Error: 'Error',
  Disabled: 'Disabled',
  Success: 'Success',
})

const disabled = state === 'Disabled'
const success = state === 'Success'
const showError = state === 'Error'

export default {
  example: figma.code`
    <InputField
      type="${type}"
      label="${label}"
      value="${value}"
      ${required ? 'required' : ''}
      ${infoIcon ? 'infoIcon' : ''}
      ${disabled ? 'disabled' : ''}
      ${success ? 'success' : ''}
      ${showHelperText ? 'showHelperText' : ''}
      ${showHelperText ? figma.code`helperText="${helperText}"` : ''}
      ${showError ? figma.code`errorMessage="${errorMessage}"` : ''}
      ${success ? figma.code`successMessage="${successMessage}"` : ''}
    />
  `,
  imports: ["import { InputField } from 'src/components/atoms/InputField.jsx'"],
  id: 'input-field',
  metadata: { nestable: true },
}

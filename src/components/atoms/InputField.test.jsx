import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { InputField } from './InputField.jsx'

describe('InputField', () => {
  it('renders a success message', () => {
    render(
      <InputField
        label="Account number"
        value="123456789"
        success
        successMessage="Account number verified"
      />,
    )

    expect(screen.getByText('Account number verified')).toBeInTheDocument()
  })
})

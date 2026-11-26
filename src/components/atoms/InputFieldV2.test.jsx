import { useState } from 'react'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { InputField } from './InputField.jsx'
import { InputFieldV2 } from './InputFieldV2.jsx'
import { TripDatesCard } from '../../steps/service/TripDatesCard.jsx'

const LABEL = 'Date you need the documents back'

afterEach(cleanup)

function TripDatesHarness() {
  const [trip, setTrip] = useState({ passportBackDate: '', travelDate: '' })
  return (
    <TripDatesCard
      {...trip}
      onChange={(key, value) => setTrip((current) => ({ ...current, [key]: value }))}
    />
  )
}

describe('InputFieldV2', () => {
  it('uses the updated date placeholder, version marker and required label', () => {
    render(<InputFieldV2 label={LABEL} required />)
    const field = screen.getByRole('textbox', { name: LABEL })
    expect(field).toHaveAttribute('placeholder', 'DD/MM/YYYY')
    expect(field).toBeRequired()
    expect(field.closest('.input-field')).toHaveAttribute('data-design-version', '2')
  })

  it('leaves the original component unchanged', () => {
    render(<InputField type="Date" label="Original date" />)
    const field = screen.getByRole('textbox', { name: 'Original date' })
    expect(field).toHaveAttribute('placeholder', 'Day/month/year')
    expect(field.closest('.input-field')).not.toHaveClass('input-field--v2')
  })

  it('preserves explicit placeholders and custom classes', () => {
    render(<InputFieldV2 label={LABEL} placeholder="Choose a date" className="custom-date" />)
    expect(screen.getByPlaceholderText('Choose a date').closest('.input-field'))
      .toHaveClass('input-field--v2', 'custom-date')
  })

  it('retains accessible error and disabled states', () => {
    const { rerender } = render(<InputFieldV2 label={LABEL} errorMessage="Enter a valid date" onChange={() => {}} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Enter a valid date')
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid date')
    rerender(<InputFieldV2 label={LABEL} disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('retains the success message', () => {
    render(<InputFieldV2 label={LABEL} success successMessage="Date confirmed" value="25/12/2099" onChange={() => {}} />)
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Date confirmed')
    expect(screen.getByRole('textbox')).toHaveValue('25/12/2099')
  })

  it('uses V2 for both trip-date fields and preserves slash-separated values', async () => {
    const user = userEvent.setup()
    render(<TripDatesHarness />)
    const field = screen.getByRole('textbox', { name: LABEL })
    const optional = screen.getByRole('textbox', { name: 'Travel date' })
    expect(optional).not.toBeRequired()
    expect(optional).toHaveAttribute('placeholder', 'DD/MM/YYYY')
    await user.type(field, '25/12/2099')
    expect(field).toHaveValue('25/12/2099')
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps the existing calendar selection behavior', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TripDatesCard passportBackDate="25/12/2099" travelDate="" onChange={onChange} />)
    await user.click(screen.getByRole('textbox', { name: LABEL }))
    const calendar = screen.getByRole('dialog', { name: LABEL })
    expect(within(calendar).getByText('December 2099')).toBeInTheDocument()
    await user.click(within(calendar).getByRole('button', { name: '26/12/2099' }))
    expect(onChange).toHaveBeenCalledWith('passportBackDate', '26/12/2099')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

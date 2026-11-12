import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MobileTotalBar } from './MobileTotalBar.jsx'

const summary = [
  {
    id: 't1',
    kind: 'applicant',
    label: 'Applicant 1',
    price: '$0.00',
    children: [],
  },
]

describe('MobileTotalBar', () => {
  it('keeps Next clickable when the step is invalid and opens the summary sheet', async () => {
    const user = userEvent.setup()
    const onNext = vi.fn()
    render(
      <MobileTotalBar
        total="$0.00"
        summary={summary}
        nextEnabled={false}
        nextLabel="Next step"
        onNext={onNext}
      />,
    )

    const next = screen.getByRole('button', { name: 'Next step' })
    expect(next).toHaveAttribute('aria-disabled', 'true')
    await user.click(next)
    expect(onNext).toHaveBeenCalledOnce()

    const trigger = screen.getByRole('button', { name: 'View order summary, total $0.00' })
    await user.click(trigger)
    expect(screen.getByRole('dialog', { name: 'Order summary' })).toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard('{Escape}')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveFocus()
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Order summary' })).not.toBeInTheDocument()
    })
  })
})

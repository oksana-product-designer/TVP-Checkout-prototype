import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { OrderProvider } from '../../state/OrderContext.jsx'
import { PromoSection } from './PromoSection.jsx'

describe('PromoSection', () => {
  afterEach(cleanup)

  it('rejects an unknown code and applies test0', async () => {
    const user = userEvent.setup()
    render(
      <OrderProvider>
        <PromoSection />
      </OrderProvider>,
    )

    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()

    await user.type(screen.getByRole('textbox', { name: 'Promo code' }), 'nope')
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    expect(screen.getByText('This promo code is not valid or has expired')).toBeInTheDocument()

    await user.clear(screen.getByRole('textbox', { name: 'Promo code' }))
    await user.type(screen.getByRole('textbox', { name: 'Promo code' }), 'test0')
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    expect(screen.getByText('Promo code applied')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Applied' })).toBeDisabled()
  })
})

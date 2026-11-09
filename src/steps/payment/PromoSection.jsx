import { useState } from 'react'
import { Button } from '../../components/atoms/Button.jsx'
import { InputField } from '../../components/atoms/InputField.jsx'
import { Card } from '../../components/organisms/Card.jsx'
import { FormSection } from '../../components/organisms/FormSection.jsx'
import { findPromo } from '../../state/totals.js'
import { useOrder } from '../../state/useOrder.js'
import './PromoSection.css'

export function PromoSection() {
  const { order, setOrder } = useOrder()
  const [invalid, setInvalid] = useState(false)
  const { code, appliedCode } = order.promo
  const applied = Boolean(appliedCode)
  const trimmed = code.trim()

  function patchPromo(promo) {
    setOrder((current) => ({ ...current, promo }))
  }

  function apply() {
    const match = findPromo(trimmed)
    setInvalid(!match)
    patchPromo(match ? { code: match.code, appliedCode: match.code } : { code, appliedCode: null })
  }

  return (
    <Card>
      <FormSection title="Discount code">
        <div className="promo-section__row">
          <InputField
            label="Promo code"
            value={code}
            placeholder="Enter promo code"
            errorMessage={invalid ? 'This promo code is not valid or has expired' : ''}
            success={applied}
            successMessage={applied ? 'Promo code applied' : ''}
            onChange={(event) => {
              setInvalid(false)
              patchPromo({ code: event.target.value, appliedCode: null })
            }}
          />
          <div className="promo-section__apply">
            <Button
              type="Secondary"
              label={applied ? 'Applied' : 'Apply'}
              showLeadingIcon={applied}
              leadingIcon="check"
              disabled={!trimmed || applied}
              onClick={apply}
            />
          </div>
        </div>
      </FormSection>
    </Card>
  )
}

import { Button } from '../atoms/Button.jsx'
import { Checkbox } from '../atoms/Checkbox.jsx'
import { InputField } from '../atoms/InputField.jsx'
import { ButtonGroup } from '../molecules/ButtonGroup.jsx'
import { ButtonGroupItem } from '../molecules/ButtonGroupItem.jsx'
import { FormSection } from './FormSection.jsx'
import './CorporateAccount.css'

export function CorporateAccount({
  hasAccount = false,
  accountNumber = '',
  status = 'idle',
  showEmptyError = false,
  onHasAccountChange,
  onAccountNumberChange,
  onValidate,
  learnMore = false,
  onLearnMoreChange,
  className = '',
}) {
  const trimmed = accountNumber.trim()
  const canValidate = trimmed.length > 0 && status !== 'valid'
  const errorMessage = showEmptyError && !trimmed
    ? 'Enter your account number to continue'
    : status === 'invalid'
      ? 'Account number not found. Check the number and try again.'
      : ''

  return (
    <div className={['corporate-account', className].filter(Boolean).join(' ')}>
      <FormSection title="Do you have a corporate account?">
        <ButtonGroup
          label="Do you have a corporate account?"
          value={hasAccount ? 'yes' : 'no'}
          onChange={(value) => onHasAccountChange?.(value === 'yes')}
        >
          <ButtonGroupItem value="no" label="No, I don't" />
          <ButtonGroupItem value="yes" label="Yes, I have" />
        </ButtonGroup>

        {hasAccount ? (
          <div className="corporate-account__number-row">
            <InputField
              type="Text"
              label="Account number"
              required
              value={accountNumber}
              placeholder="Enter your account number"
              errorMessage={errorMessage}
              success={status === 'valid'}
              successMessage={status === 'valid' ? 'Account verified' : ''}
              onChange={(event) => onAccountNumberChange?.(event.target.value)}
            />
            <div className="corporate-account__validate">
              <Button
                type="Secondary"
                label={status === 'valid' ? 'Account verified' : 'Check account'}
                showLeadingIcon={status === 'valid'}
                leadingIcon="check"
                disabled={!canValidate}
                onClick={() => onValidate?.(trimmed)}
              />
            </div>
          </div>
        ) : null}

        {hasAccount ? null : (
          <Checkbox
            checked={learnMore}
            label="Email me about business accounts"
            infoLabel="About business accounts"
            infoText="A business account is a company plan. It applies your company discount and can fill in your usual delivery address."
            onChange={(event) => onLearnMoreChange?.(event.target.checked)}
          />
        )}
      </FormSection>
    </div>
  )
}

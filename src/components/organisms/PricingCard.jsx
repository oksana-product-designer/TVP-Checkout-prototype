import { Button } from '../atoms/Button.jsx'
import { TextLink } from '../atoms/TextLink.jsx'
import { FeatureItem } from '../molecules/FeatureItem.jsx'
import './PricingCard.css'

export function PricingCard({
  orientation = 'Vertical',
  active = false,
  name,
  tagline,
  price,
  comparePrice = '',
  priceNote = '',
  showPrice = true,
  lead,
  showLead = true,
  showBanner = false,
  bannerLabel,
  features = [],
  moreCount = 0,
  moreLabel,
  moreExpanded = false,
  onSelect,
  onMore,
  selectProps,
  className = '',
}) {
  const classes = [
    'pricing-card',
    orientation === 'Horizontal' ? 'pricing-card--horizontal' : 'pricing-card--vertical',
    active ? 'pricing-card--active' : 'pricing-card--inactive',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const selectButton = (
    <Button
      className="pricing-card__select"
      type="Secondary"
      size="Small"
      label={active ? 'Selected' : 'Select'}
      showLeadingIcon={active}
      leadingIcon="check"
      onClick={onSelect}
      {...selectProps}
    />
  )

  const featureList = (
    <div className="pricing-card__features">
      {features.map((feature) => (
        <FeatureItem key={feature} label={feature} />
      ))}
      {moreLabel || moreCount > 0 ? (
        <TextLink
          className={active ? 'pricing-card__more pricing-card__more--active' : 'pricing-card__more'}
          label={moreLabel || `${moreCount} more`}
          aria-expanded={moreLabel ? moreExpanded : undefined}
          onClick={onMore}
        />
      ) : null}
    </div>
  )

  if (orientation === 'Horizontal') {
    return (
      <article className={classes}>
        <div className="pricing-card__intro">
          <h3 className="pricing-card__name pricing-card__name--large">{name}</h3>
          {tagline ? <p className="pricing-card__tagline pricing-card__tagline--body">{tagline}</p> : null}
          {showPrice ? (
            <p className="pricing-card__price">
              {comparePrice ? <span className="pricing-card__compare">{comparePrice}</span> : null}
              <span className="pricing-card__amount">{price}</span>
              {priceNote ? <span className="pricing-card__note">{priceNote}</span> : null}
            </p>
          ) : null}
          {selectButton}
        </div>
        <div className="pricing-card__column">
          {showLead && lead ? <p className="pricing-card__lead">{lead}</p> : null}
          {featureList}
        </div>
      </article>
    )
  }

  return (
    <article className={classes}>
      <div className="pricing-card__banner-row">
        {showBanner && bannerLabel ? (
          <p className="pricing-card__banner">{bannerLabel}</p>
        ) : null}
      </div>
      <div className="pricing-card__body">
        <h3 className="pricing-card__name">{name}</h3>
        {showPrice ? (
          <p className="pricing-card__price">
            {comparePrice ? <span className="pricing-card__compare">{comparePrice}</span> : null}
            <span className="pricing-card__amount">{price}</span>
            {priceNote ? <span className="pricing-card__note">{priceNote}</span> : null}
          </p>
        ) : null}
        {selectButton}
        {tagline ? <p className="pricing-card__tagline">{tagline}</p> : null}
        {showLead && lead ? <p className="pricing-card__lead">{lead}</p> : null}
        {featureList}
      </div>
    </article>
  )
}

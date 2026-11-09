import { useEffect, useState } from 'react'
import { Card } from '../../components/organisms/Card.jsx'
import { FormSection } from '../../components/organisms/FormSection.jsx'
import { PricingCard } from '../../components/organisms/PricingCard.jsx'
import packages from '../../mocks/packages.json'
import { useOrder } from '../../state/useOrder.js'
import './VipStep.css'

const packageOrder = packages.filter((item) => item.orientation === 'vertical')

export function VipStep() {
  const { order, setOrder } = useOrder()
  const [expanded, setExpanded] = useState(false)
  const selectedId = packageOrder.some((item) => item.id === order.vipPackageId)
    ? order.vipPackageId
    : 'lite'

  useEffect(() => {
    if (selectedId !== order.vipPackageId) {
      setOrder((current) => ({ ...current, vipPackageId: selectedId }))
    }
  }, [order.vipPackageId, selectedId, setOrder])

  function selectPackage(id) {
    setOrder((current) => ({ ...current, vipPackageId: id }))
  }

  function toggleExpanded() {
    setExpanded((current) => !current)
  }

  function onPackageKeyDown(event) {
    const key = event.key
    if (key !== 'ArrowRight' && key !== 'ArrowDown' && key !== 'ArrowLeft' && key !== 'ArrowUp') return
    if (event.target.getAttribute('role') !== 'radio') return
    event.preventDefault()
    const ids = packageOrder.map((item) => item.id)
    const index = Math.max(0, ids.indexOf(selectedId))
    const delta = key === 'ArrowRight' || key === 'ArrowDown' ? 1 : -1
    const nextId = ids[(index + delta + ids.length) % ids.length]
    selectPackage(nextId)
    requestAnimationFrame(() => {
      document.getElementById(`vip-package-${nextId}`)?.focus()
    })
  }

  return (
    <Card>
      <FormSection title="Choose a package.">
        <div
          className="vip-step__choices"
          role="radiogroup"
          aria-label="Choose a package."
          onKeyDown={onPackageKeyDown}
        >
          <div className={expanded ? 'vip-step__packages vip-step__packages--open' : 'vip-step__packages'}>
            {packageOrder.map((item) => (
              <PackageChoice
                key={item.id}
                item={item}
                active={selectedId === item.id}
                expanded={expanded}
                onSelect={() => selectPackage(item.id)}
                onMore={toggleExpanded}
              />
            ))}
          </div>
        </div>
      </FormSection>
    </Card>
  )
}

function PackageChoice({ item, active, expanded, onSelect, onMore }) {
  const hiddenCount = Math.max(0, item.fullFeatures.length - item.features.length)
  const open = expanded && hiddenCount > 0
  return (
    <PricingCard
      orientation={item.orientation === 'horizontal' ? 'Horizontal' : 'Vertical'}
      active={active}
      name={item.name}
      tagline={item.tagline}
      price={`$${item.price}`}
      comparePrice={item.compareAt != null ? `$${item.compareAt}` : ''}
      showPrice
      lead={item.lead || ''}
      showLead={Boolean(item.lead)}
      showBanner={Boolean(item.banner)}
      bannerLabel={item.banner || ''}
      features={open ? item.fullFeatures : item.features}
      moreCount={hiddenCount}
      moreLabel={hiddenCount > 0 ? (open ? 'Show less' : `${hiddenCount} more`) : ''}
      moreExpanded={open}
      onSelect={onSelect}
      onMore={onMore}
      selectProps={{
        id: `vip-package-${item.id}`,
        role: 'radio',
        'aria-checked': active,
        tabIndex: active ? 0 : -1,
      }}
    />
  )
}

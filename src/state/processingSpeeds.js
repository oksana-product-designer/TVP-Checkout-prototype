import speeds from '../mocks/processing-speeds.json'
import { parseDisplayDate } from './validation.js'

const DAY = 24 * 60 * 60 * 1000

function daysLeft(passportBackDate, today) {
  const date = parseDisplayDate(passportBackDate)
  if (!date) return null
  const start = new Date(today)
  start.setHours(0, 0, 0, 0)
  return Math.round((date - start) / DAY)
}

function fitsDate(speed, left) {
  return left === null || speed.days <= left
}

// Speeds that cannot meet the "documents back" date are left out. The fastest speed is always
// offered. Recommended = the slowest (cheapest) speed that still makes the date.
export function getSpeedOptions(passportBackDate, today = new Date()) {
  const left = daysLeft(passportBackDate, today)
  const fastest = Math.min(...speeds.map((speed) => speed.days))
  const available = speeds.filter((speed) => fitsDate(speed, left) || speed.days === fastest)
  const recommendedDays = left === null ? null : Math.max(...available.map((speed) => speed.days))

  return available.map((speed) => {
    const badges = []
    if (speed.days === recommendedDays) badges.push({ label: 'Recommended', tone: 'success' })
    else if (speed.badge) badges.push({ label: speed.badge, tone: 'brand' })
    return {
      id: speed.id,
      label: speed.label,
      priceLabel: Number.isFinite(speed.fromPrice) ? `from $${speed.fromPrice}` : '',
      badges,
    }
  })
}

export function isSpeedAvailable(speedId, passportBackDate, today = new Date()) {
  return getSpeedOptions(passportBackDate, today).some((option) => option.id === speedId)
}

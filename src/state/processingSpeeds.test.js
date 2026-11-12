import { describe, expect, it } from 'vitest'
import { getSpeedOptions } from './processingSpeeds.js'

const today = new Date(2026, 10, 9)

function summary(date) {
  return Object.fromEntries(
    getSpeedOptions(date, today).map((option) => [option.id, option.badges.map((badge) => badge.label)]),
  )
}

describe('getSpeedOptions', () => {
  it('lists every speed and recommends nothing without a date', () => {
    const result = summary('')
    expect(Object.keys(result)).toEqual(['2-days', '1-week', '2-weeks', '4-weeks'])
    expect(getSpeedOptions('', today).map((option) => option.priceLabel)).toEqual([
      'from $99',
      'from $59',
      'from $39',
      'from $20',
    ])
    expect(Object.values(result).some((badges) => badges.includes('Recommended'))).toBe(false)
  })

  it('leaves out speeds slower than the time left and recommends the slowest that fits', () => {
    const result = summary('20/11/2026') // 11 days left
    expect(Object.keys(result)).toEqual(['2-days', '1-week'])
    expect(result['1-week']).toEqual(['Recommended'])
    expect(result['2-days']).toEqual(['Fastest'])
  })

  it('still offers the fastest speed when the date is too close, with one badge', () => {
    expect(summary('10/11/2026')).toEqual({ '2-days': ['Recommended'] }) // 1 day left
  })

  it('shows Recommended instead of Cheapest when that speed also meets the date', () => {
    const result = summary('31/12/2026')
    expect(result['4-weeks']).toEqual(['Recommended'])
    expect(result['2-days']).toEqual(['Fastest'])
    expect(Object.values(result).every((badges) => badges.length <= 1)).toBe(true)
  })
})

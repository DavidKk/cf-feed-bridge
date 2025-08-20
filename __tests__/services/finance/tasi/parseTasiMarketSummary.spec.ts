import htmlContent from './mock'
import { parseTasiMarketSummary } from '@/services/finance/tasi/parseTasiMarketSummary'

describe('parseTasiMarketSummary', () => {
  it('parses market summary and date', async () => {
    const res = parseTasiMarketSummary(htmlContent)
    expect(res.date).toEqual('2025-08-18')
    expect(res.open).toBeCloseTo(10897.08, 3)
    expect(res.high).toBeCloseTo(10902.52, 3)
    expect(res.low).toBeCloseTo(10847.07, 3)
    expect(res.close).toBeCloseTo(10885.58, 3)
    expect(res.change).toBeCloseTo(-11.81, 3)
    expect(res.changePercent).toBeCloseTo(-0.11, 3)
    expect(res.companiesTraded).toEqual(259)
    expect(res.volumeTraded).toEqual(216532966)
    expect(res.valueTraded).toBeCloseTo(3869385109.53, 5)
    expect(res.numberOfTrades).toEqual(461329)
    expect(res.marketCap).toBeCloseTo(9005887498707.9, 5)
  })
})

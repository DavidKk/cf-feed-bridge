import htmlContent from './mock'
import { parseTasiMarketSummary } from '@/services/finance/tasi/parseTasiMarketSummary'

describe('parseTasiMarketSummary', () => {
  it('parses market summary and date', async () => {
    const res = parseTasiMarketSummary(htmlContent)
    expect(res.date).toEqual('2025-08-18')
    // Open value from sample is 10,897.08
    expect(res.values['open']).toBeCloseTo(10897.08, 3)
  })
})

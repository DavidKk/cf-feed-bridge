import * as fs from 'fs'
import * as path from 'path'
import { parseTasiMarketSummary } from '@/services/finance/tasi/parseTasiMarketSummary'

const FIXTURE_PATH = path.join(__dirname, '../../../fixtures/tasi-daily-report.html')

function loadFixture(): string {
  return fs.readFileSync(FIXTURE_PATH, 'utf-8')
}

describe('parseTasiMarketSummary', () => {
  it('should parse market summary from fixture and extract date', () => {
    const htmlContent = loadFixture()
    const res = parseTasiMarketSummary(htmlContent)
    expect(res.date).toEqual('2026-03-12')
  })

  it('should parse OHLC and change from Market Summary table', () => {
    const htmlContent = loadFixture()
    const res = parseTasiMarketSummary(htmlContent)
    expect(res.open).toBeCloseTo(10946.16, 3)
    expect(res.high).toBeCloseTo(10986.41, 3)
    expect(res.low).toBeCloseTo(10877.76, 3)
    expect(res.close).toBeCloseTo(10893.27, 3)
    expect(res.change).toBeCloseTo(-48.73, 3)
    expect(res.changePercent).toBeCloseTo(-0.45, 3)
  })

  it('should parse companies traded, volume, value, trades, market cap', () => {
    const htmlContent = loadFixture()
    const res = parseTasiMarketSummary(htmlContent)
    expect(res.companiesTraded).toEqual(269)
    expect(res.volumeTraded).toEqual(236209008)
    expect(res.valueTraded).toBeCloseTo(5030454017.74, 5)
    expect(res.numberOfTrades).toEqual(403412)
    expect(res.marketCap).toBeCloseTo(9622978677690.69, 5)
  })
})

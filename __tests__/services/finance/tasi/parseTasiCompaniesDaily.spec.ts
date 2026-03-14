import * as fs from 'fs'
import * as path from 'path'
import { parseTasiCompaniesDaily } from '@/services/finance/tasi/parseTasiCompaniesDaily'

const FIXTURE_PATH = path.join(__dirname, '../../../fixtures/tasi-daily-report.html')

function loadFixture(): string {
  return fs.readFileSync(FIXTURE_PATH, 'utf-8')
}

describe('parseTasiCompaniesDaily', () => {
  it('should parse fixture (tasi-daily-report.html) and return company list', () => {
    const htmlContent = loadFixture()
    const result = parseTasiCompaniesDaily(htmlContent)
    expect(result.length).toBeGreaterThan(250)
    expect(result[0].date).toEqual('2026-03-12')
  })

  it('should map first row: Symbol 2030, Company SARCO with correct columns', () => {
    const htmlContent = loadFixture()
    const result = parseTasiCompaniesDaily(htmlContent)
    const first = result[0]
    expect(first.code).toEqual('2030')
    expect(first.name).toEqual('SARCO')
    expect(first.no).toBeNull()
    expect(first.open).toEqual(48.7)
    expect(first.high).toEqual(49.32)
    expect(first.low).toEqual(48.6)
    expect(first.lastPrice).toEqual(48.6)
    expect(first.changePercent).toEqual(-0.16)
    expect(first.volume).toEqual(37017)
    expect(first.turnover).toEqual(1810214.6)
    expect(first.numberOfTrades).toEqual(332)
    expect(first.marketCap).toEqual(729000000)
    expect(first.date).toEqual('2026-03-12')
  })

  it('should compute derived prevClose, change, amplitude, turnoverRate for first row', () => {
    const htmlContent = loadFixture()
    const result = parseTasiCompaniesDaily(htmlContent)
    const first = result[0]
    expect(first.prevClose).not.toBeNull()
    expect(first.change).not.toBeNull()
    expect(first.amplitude).not.toBeNull()
    expect(first.turnoverRate).not.toBeNull()
    expect(first.prevClose).toBeCloseTo(48.678, 2)
    expect(first.change).toBeCloseTo(-0.078, 2)
    expect(first.amplitude).toBeCloseTo(1.48, 1)
    expect(first.turnoverRate).toBeCloseTo(0.25, 1)
  })

  it('should include SAUDI ARAMCO as second row with code 2222', () => {
    const htmlContent = loadFixture()
    const result = parseTasiCompaniesDaily(htmlContent)
    const aramco = result[1]
    expect(aramco.code).toEqual('2222')
    expect(aramco.name).toEqual('SAUDI ARAMCO')
    expect(aramco.lastPrice).toEqual(26.86)
  })
})

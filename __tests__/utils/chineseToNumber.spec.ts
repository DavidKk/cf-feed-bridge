import { chineseToNumber } from '@/utils/chineseToNumber'

describe('chineseToNumber', () => {
  it('should return 0 for invalid Chinese numbers', () => {
    expect(chineseToNumber('')).toBe(0)
    expect(chineseToNumber('Hello')).toBe(0)
    expect(chineseToNumber('123')).toBe(0)
    expect(chineseToNumber('一百二十万三千零四')).toBe(1203004)
  })

  it('should correctly convert single-digit Chinese numbers', () => {
    expect(chineseToNumber('一')).toBe(1)
    expect(chineseToNumber('二')).toBe(2)
    expect(chineseToNumber('三')).toBe(3)
    expect(chineseToNumber('十')).toBe(10)
    expect(chineseToNumber('百')).toBe(100)
  })

  it('should correctly convert multi-digit Chinese numbers', () => {
    expect(chineseToNumber('十一')).toBe(11)
    expect(chineseToNumber('二十')).toBe(20)
    expect(chineseToNumber('二十一')).toBe(21)
    expect(chineseToNumber('一百二十')).toBe(120)
    expect(chineseToNumber('一百零八')).toBe(108)
    expect(chineseToNumber('一千二百三十四')).toBe(1234)
    expect(chineseToNumber('一万')).toBe(10000)
    expect(chineseToNumber('十万')).toBe(100000)
    expect(chineseToNumber('一百万')).toBe(1000000)
    expect(chineseToNumber('一亿')).toBe(100000000)
  })

  it('should correctly convert complex Chinese numbers', () => {
    expect(chineseToNumber('一万零一')).toBe(10001)
    expect(chineseToNumber('一万零一十')).toBe(10010)
    expect(chineseToNumber('一万零一百')).toBe(10100)
    expect(chineseToNumber('一万零一百零一')).toBe(10101)
    expect(chineseToNumber('一百万零一')).toBe(1000001)
    expect(chineseToNumber('一亿零一万零一')).toBe(100010001)
    expect(chineseToNumber('一亿零二百万三千四百五十六')).toBe(102003456)
    expect(chineseToNumber('一千二百三十四万五千六百七十八')).toBe(12345678)
  })

  it('should correctly convert numbers with 亿 and 万', () => {
    expect(chineseToNumber('一亿')).toBe(100000000)
    expect(chineseToNumber('一亿一千')).toBe(100001000)
    expect(chineseToNumber('一亿零一万')).toBe(100010000)
    expect(chineseToNumber('一亿零一')).toBe(100000001)
    expect(chineseToNumber('一亿零一百二十三万四千五百六十七')).toBe(101234567)
  })
})

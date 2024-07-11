const CHINESE_NUMBERS = {
  零: 0,
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  十: 10,
  百: 100,
  千: 1e3,
  万: 1e4,
  亿: 1e8,
}

export function isChineseNumber(chars: string[]): chars is (keyof typeof CHINESE_NUMBERS)[] {
  for (const char of chars) {
    if (!(char in CHINESE_NUMBERS)) {
      return false
    }
  }

  return true
}

export function chineseToNumber(chineseNumber: string): number {
  if (typeof chineseNumber !== 'string') {
    return 0
  }

  const chineseChars = chineseNumber.split('')
  if (!isChineseNumber(chineseChars)) {
    return 0
  }

  let result = 0
  let temp = 0
  let billion = 0

  for (let i = 0; i < chineseChars.length; i++) {
    const char = chineseChars[i]
    const num = CHINESE_NUMBERS[char]

    if (num === 1e8) {
      result += temp
      result *= num
      billion = result
      temp = 0
      result = 0
    } else if (num === 1e4) {
      result += temp
      result *= num
      temp = 0
    } else if (num >= 10) {
      temp = (temp === 0 ? 1 : temp) * num
    } else {
      temp += num
    }
  }

  result += temp
  result += billion

  return result
}

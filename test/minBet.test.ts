import { getDefaultMinBetDenomIndex, minBetToExcelDenomListMap, gameIdMinBetMap, minBetCurrencyToDefaultDenomNthMap } from "../src/minBet"

describe("minBet.ts tests", () => {
  beforeEach(() => {
    minBetToExcelDenomListMap.clear()
    gameIdMinBetMap.clear()
    minBetCurrencyToDefaultDenomNthMap.clear()
  })

  test("minBetToExcelDenomListMap should be empty initially", () => {
    expect(minBetToExcelDenomListMap.size).toBe(0)
  })

  test("gameIdMinBetMap should be empty initially", () => {
    expect(gameIdMinBetMap.size).toBe(0)
  })

  test("minBetCurrencyToDefaultDenomNthMap should be empty initially", () => {
    expect(minBetCurrencyToDefaultDenomNthMap.size).toBe(0)
  })

  test("getDefaultMinBetDenomIndex returns null when no data", () => {
    const result = getDefaultMinBetDenomIndex("game123", "USD")
    expect(result).toBeNull()
  })
})

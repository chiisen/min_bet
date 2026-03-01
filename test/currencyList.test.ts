import { currencyList, currencyDataList } from "../src/currencyList"

describe("currencyList.ts tests", () => {
  beforeEach(() => {
    currencyList.length = 0
    currencyDataList.length = 0
  })

  test("currencyList should be empty initially", () => {
    expect(currencyList.length).toBe(0)
  })

  test("currencyDataList should be empty initially", () => {
    expect(currencyDataList.length).toBe(0)
  })

  test("currencyList can store currencies", () => {
    currencyList.push("USD")
    currencyList.push("CNY")
    expect(currencyList.length).toBe(2)
  })

  test("currencyDataList can store currency data", () => {
    currencyDataList.push({ currency: "USD", cryDef: 1, desc: "US Dollar" })
    expect(currencyDataList.length).toBe(1)
    expect(currencyDataList[0].currency).toBe("USD")
  })
})

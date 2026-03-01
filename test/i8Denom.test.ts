import { i8DenomMap, initI8Denom } from "../src/i8Denom"

describe("i8Denom.ts tests", () => {
  beforeEach(() => {
    i8DenomMap.clear()
  })

  test("i8DenomMap should be empty initially", () => {
    expect(i8DenomMap.size).toBe(0)
  })

  test("i8DenomMap can store and retrieve data", () => {
    i8DenomMap.set("game1-USD", { gameId: "game1", currency: "USD", denom: "15,14,13", defaultDenomId: 15 })
    const data = i8DenomMap.get("game1-USD")
    expect(data).toBeDefined()
    expect(data?.gameId).toBe("game1")
    expect(data?.currency).toBe("USD")
  })
})

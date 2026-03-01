import { hallNameMap, initHallName } from "../src/hallName"

describe("hallName.ts tests", () => {
  beforeEach(() => {
    hallNameMap.clear()
  })

  test("hallNameMap should be empty initially", () => {
    expect(hallNameMap.size).toBe(0)
  })

  test("hallNameMap can store and retrieve data", () => {
    hallNameMap.set("cid123", { cid: "cid123", userName: "test_hall", nickName: "Test Hall", upId: "-1", state: "active", dc: "I8" })
    const data = hallNameMap.get("cid123")
    expect(data).toBeDefined()
    expect(data?.cid).toBe("cid123")
    expect(data?.userName).toBe("test_hall")
  })
})

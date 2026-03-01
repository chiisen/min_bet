import { hallSettingMap, initHallSetting } from "../src/hallSetting"

describe("hallSetting.ts tests", () => {
  beforeEach(() => {
    hallSettingMap.clear()
  })

  test("hallSettingMap should be empty initially", () => {
    expect(hallSettingMap.size).toBe(0)
  })

  test("hallSettingMap can store and retrieve data", () => {
    hallSettingMap.set("I8", { dc: "I8", normal: true, normal_1By1: true, funky: false, php: false, vnd2: false, normal_1By1_and_1000By1: false, kbb_1By1: false, twd_1By1: false })
    const data = hallSettingMap.get("I8")
    expect(data).toBeDefined()
    expect(data?.dc).toBe("I8")
    expect(data?.normal_1By1).toBe(true)
  })
})

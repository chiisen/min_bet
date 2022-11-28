import { hello } from "../src"

/**
 * 單元測試用
 */
test("hello", () => {
  expect(hello("World")).toEqual("Hello World")
})

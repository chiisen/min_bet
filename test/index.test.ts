import { hello } from "../src"

describe("index.ts tests", () => {
  test("hello function returns correct greeting", () => {
    expect(hello("World")).toBe("Hello World")
    expect(hello("Alice")).toBe("Hello Alice")
  })
})

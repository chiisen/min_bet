import clc = require("cli-color")

import { denomToIndexMap } from "./data"

/**
 * 交換 Map 的 Key 與 Value
 *
 * @param x
 * @return @note回傳回去的 value 會是陣列，目前還未解決
 */
export const swapMap = (x) => {
  return [...x.entries()].reduce((acc, [k, v]) => {
    acc.has(v) ? acc.set(v, acc.get(v).concat(k)) : acc.set(v, [k])
    return acc
  }, new Map())
}

/**
 * 將面額【字串】陣列轉成【數值】陣列
 *
 * @param {*} denomStr
 */
export function denomIndexArray(denomStr: string, isLog = false) {
  const arr = denomStr.split(",")
  const IdxArr = arr.map((x) => {
    const ret = denomToIndexMap.get(x.trim())
    if (ret === undefined) {
      console.log(clc.magenta("找不到面額: ") + clc.red(x))
    }
    return ret
  })

  if (isLog) {
    console.log("面額索引陣列: " + clc.yellow(IdxArr))
  }
  return IdxArr
}

/**
 * 將面額【數值】陣列轉成【字串】陣列
 *
 * @param {*} num
 */
export function denomArray(num: number, isSort = false) {
  const srcArr = num.toString().split(",") // .toString() 修正某些情況，轉換出數值，造成例外

  let arr = []
  if (isSort) {
    console.log(srcArr)

    arr = srcArr.sort()

    console.log(arr)
  } else {
    arr = srcArr
  }

  const IdxArr = arr.map((x) => {
    const n = Number(x)
    const ret = denomToIndexMap.get(n.toString())
    if (ret === undefined) {
      console.log(clc.magenta("找不到面額索引: ") + clc.red(x))
    }
    return `"${ret}"`
  })

  console.log("面額陣列: " + clc.yellow(IdxArr))
  return IdxArr
}

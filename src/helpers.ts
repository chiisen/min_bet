import clc = require("cli-color")
import fs = require("fs")

import { denomToIndexMap, denomIdxToDenomStrArrayMap } from "./data"

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

/**
 * 插入文字到 alter.sql
 *
 * @param {*} subPath
 * @param {*} insertText
 */
export function appendAlterByFileName(subPath, fileName, insertText) {
  fs.appendFileSync(`${subPath}/${fileName}`, insertText, "utf8")
}

/**
 * 【面額索引】轉成【面額字串】
 *
 * @returns
 */
export function convertDenomIdxToDenomStr(denomIdx) {
  const denomIdxNumber_ = Number(denomIdx)
  const denom_ = denomIdxToDenomStrArrayMap.get(denomIdxNumber_)
  if (!denom_) {
    console.error(`denom_ is null(denomIdx_: ${denomIdx})`)
    return
  }
  return denom_[0]
}

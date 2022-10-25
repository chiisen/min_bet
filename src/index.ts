import clc = require("cli-color")
import fs = require("fs")
import dotenv = require("dotenv")

import {
  denomToRatioMap,
  betLevelList,
  minBetList,
  cryDef,
  denomToIndexMap,
  denomTitleLIst,
  denomIndexTitleList,
  ratioToDenomArrayMap,
  denomIdxToDenomStrArrayMap,
} from "./data"
import { writeSinglePageExcel } from "./excel"

import { processSQL } from "./sql"

const envFile = ".env"
if (!fs.existsSync(".env")) {
  console.error(clc.red(`\n 讀檔失敗，找不到 ${envFile}`))
  process.exit(1)
}

dotenv.config()

console.log("ENV: " + process.env["ENV"]) //ENV

/**
 *
 * @param name 單元測試用
 * @returns
 */
export function hello(name: string): string {
  return `Hello ${name}`
}

/**
 * Excel 的輸出資料陣列
 */
const excelMinBetOutput_ = []

//Excel標題
excelMinBetOutput_.push(["cryDef", "minBet", ...denomTitleLIst, "denomIndex"])
excelMinBetOutput_.push(["", "", ...denomIndexTitleList, ""])

/**
 * Min Bet 中的面額最大範圍區間
 *
 * key: 面額
 *
 * value: 累計次數
 */
const maxRangeMinBetDenom_ = new Map()

const denomIdxByMinBetListMap_ = new Map()
const defaultDenomIdxByMinBetListMap_ = new Map()

minBetList.map((minBet_) => {
  /**
   * Bet Level 1-10 的計次，滿 10 次面額才算是有效
   *
   * key: 面額比率
   *
   * value: Bet Level 累計次數，要 10 次才算有效
   */
  const checkDenomRatioByBetLevelListMap = new Map()

  betLevelList.map((betLevel_) => {
    if (!denomToRatioMap) {
      console.error(`denomToRatioMap is null`)
      return
    }

    /**
     * 面額【比率】陣列
     */
    const denomRatioList = Array.from(denomToRatioMap.values())

    /**
     * result_ = minBet_ * betLevel_ * denomRatio_ / cryDef 的計算結果
     */
    let result_ = 0
    denomRatioList.map((denomRatio_) => {
      result_ = (minBet_ * betLevel_ * denomRatio_) / cryDef

      //安全範圍 0.6 到 200
      if (result_ > 0.6 && result_ < 200) {
        const existDenomRatio_ = checkDenomRatioByBetLevelListMap.get(denomRatio_)
        let minBetDenomCount = 1
        if (existDenomRatio_) {
          minBetDenomCount += existDenomRatio_
        }
        checkDenomRatioByBetLevelListMap.set(denomRatio_, minBetDenomCount)

        //const denom = ratioToDenomMap.get(denomRatio_)
        //console.log(`denomRatio_:${denomRatio_} denom:"${denom}" minBetDenomCount:${minBetDenomCount}`)
      }
    })
  })

  console.log("================================================")

  /**
   * 面額索引陣列 1...
   */
  let denomIdxArray_ = ""

  checkDenomRatioByBetLevelListMap.forEach((betLevelCount_, denomRatio_) => {
    //Bet Level 累計次數，要 10 次才算有效
    if (betLevelCount_ >= 10) {
      const denom = ratioToDenomArrayMap.get(denomRatio_)
      if (!denom) {
        console.error(`denom is null(denomRatio_: ${denomRatio_})`)
        return
      }
      const denomStr = denom[0] //面額字串
      denomIdxArray_ += denomIdxArray_ === "" ? denomToIndexMap.get(denomStr) : "," + denomToIndexMap.get(denomStr)

      const existMaxDenomCount = maxRangeMinBetDenom_.get(denomStr)
      let maxDenomCount = 1
      if (existMaxDenomCount) {
        maxDenomCount += existMaxDenomCount
      }
      maxRangeMinBetDenom_.set(denomStr, maxDenomCount)
    }
  })

  const minBetDenomStrArray_ = []
  denomIndexTitleList.map((denomIdx_: string) => {
    //denomIdx 轉 denomRatio
    const denom_ = denomIdxToDenomStrArrayMap.get(denomIdx_)
    if (!denom_) {
      console.error(`denom_ is null(denomIdx_: ${denomIdx_})`)
      return
    }
    const denomString_ = denom_[0]
    const convertDenomRatio_ = denomToRatioMap.get(denomString_)
    if (!convertDenomRatio_) {
      console.error(`convertDenomRatio_ is null(denomString_: ${denomString_})`)
      return
    }
    const existBetLvCount_ = checkDenomRatioByBetLevelListMap.get(convertDenomRatio_)
    //Bet Level 累計次數，要 10 次才算有效
    if (existBetLvCount_ && existBetLvCount_ >= 10) {
      const denomSub_ = ratioToDenomArrayMap.get(convertDenomRatio_)
      if (!denomSub_) {
        console.error(`denomSub_ is null(convertDenomRatio_: ${convertDenomRatio_})`)
        return
      }
      const denomStrSub = denomSub_[0]
      minBetDenomStrArray_.push(denomStrSub)
    } else {
      minBetDenomStrArray_.push("")
    }
  }, {})

  let defaultDenomIdx = ""
  const array = denomIdxArray_.split(",")
  if (array.length >= 2) {
    defaultDenomIdx = array[1]
  } else {
    defaultDenomIdx = array[0]
  }
  console.log(
    clc.magenta(`cryDef=${cryDef} minBet_=${minBet_} `) +
      clc.red(minBetDenomStrArray_) +
      "," +
      denomIdxArray_ +
      " default:" +
      defaultDenomIdx
  )
  excelMinBetOutput_.push([cryDef, minBet_, ...minBetDenomStrArray_, denomIdxArray_])

  denomIdxByMinBetListMap_.set(minBet_, denomIdxArray_)

  const arr = denomIdxArray_.split(",")
  if (arr.length >= 2) {
    defaultDenomIdxByMinBetListMap_.set(minBet_, arr[1])
  } else {
    defaultDenomIdxByMinBetListMap_.set(minBet_, arr[0])
  }
})

/**
 * 最大範圍的面額索引陣列 1...
 */
let maxDenomIdxArray_ = ""
let maxRangeMinBetDenomList = []
denomIndexTitleList.map((denomIdx_: string) => {
  const denom_ = denomIdxToDenomStrArrayMap.get(denomIdx_)
  if (!denom_) {
    console.error(`denom_ is null(denomIdx_: ${denomIdx_})`)
    return
  }
  const denomString_ = denom_[0]
  const denomCount_ = maxRangeMinBetDenom_.get(denomString_)
  if (denomCount_ > 0) {
    maxRangeMinBetDenomList.push(denomString_)

    maxDenomIdxArray_ +=
      maxDenomIdxArray_ === "" ? denomToIndexMap.get(denomString_) : "," + denomToIndexMap.get(denomString_)
  } else {
    maxRangeMinBetDenomList.push("")
  }
})

//寫入 Excel 最大面額範圍
excelMinBetOutput_.push([cryDef, "MaxRangeDenom", ...maxRangeMinBetDenomList, maxDenomIdxArray_])

console.log(
  clc.magenta(`cryDef=${cryDef} minBet_="MaxRangeDenom" `) + clc.red(maxRangeMinBetDenomList) + "," + maxDenomIdxArray_
)

writeSinglePageExcel("./output/minBet.xlsx", "minBetSheet", excelMinBetOutput_)

//SQL
processSQL(denomIdxByMinBetListMap_, defaultDenomIdxByMinBetListMap_)


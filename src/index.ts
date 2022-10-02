import clc = require("cli-color")

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

minBetList.map((minBet_) => {
  /**
   * Bet Level 1-10 的計次，滿 10 次面額才算是有效
   *
   * key: 面額比率
   *
   * value: Bet Level 累計次數，要 10 次才算有效
   */
  const checkDenomRatioByBetLevelList = new Map()

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
        const existDenomRatio_ = checkDenomRatioByBetLevelList.get(denomRatio_)
        let minBetDenomCount = 1
        if (existDenomRatio_) {
          minBetDenomCount += existDenomRatio_
        }
        checkDenomRatioByBetLevelList.set(denomRatio_, minBetDenomCount)

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

  checkDenomRatioByBetLevelList.forEach((betLevelCount_, denomRatio_) => {
    //Bet Level 累計次數，要 10 次才算有效
    if (betLevelCount_ >= 10) {
      const denom = ratioToDenomArrayMap.get(denomRatio_)
      if (!denom) {
        console.error(`denom is null(denomRatio_: ${denomRatio_})`)
        return
      }
      const denomStr = denom[0] //面額字串
      denomIdxArray_ += denomIdxArray_ === "" ? denomToIndexMap.get(denomStr) : "," + denomToIndexMap.get(denomStr)
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
    const existBetLvCount_ = checkDenomRatioByBetLevelList.get(convertDenomRatio_)
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

  console.log(
    clc.magenta(`cryDef=${cryDef} minBet_=${minBet_} `) + clc.red(minBetDenomStrArray_) + "," + denomIdxArray_
  )
  excelMinBetOutput_.push([cryDef, minBet_, ...minBetDenomStrArray_, denomIdxArray_])
})

writeSinglePageExcel("./minBet.xlsx", "minBetSheet", excelMinBetOutput_)

import clc = require("cli-color")

import { convertDenomIdxToDenomStr } from "./helpers"

import {
  denomToRatioMap,
  betLevelList,
  denomToIndexMap,
  denomIndexTitleList,
  ratioToDenomArrayMap,
  denomIdxToDenomStrArrayMap,
} from "./data"

export function calculate(
  cryDef,
  minBet_,
  excelMinBetOutput_,
  minBetDenomStrArray_,
  checkDenomRatioByBetLevelListMap_,
  maxRangeMinBetDenom_,
  denomIdxArray_,
  denomIdxByMinBetListMap_,
  defaultDenomIdxByMinBetListMap_
) {
  let defaultDenomIdx_ = ""
  /**
   * 面額索引陣列 1...
   */

  checkDenomRatioByBetLevelListMap_.forEach((betLevelCount_, denomRatio_) => {
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

  denomIndexTitleList.map((denomIdx_: string) => {
    //denomIdx 轉 denomRatio
    const denomString_ = convertDenomIdxToDenomStr(denomIdx_)
    const convertDenomRatio_ = denomToRatioMap.get(denomString_)
    if (!convertDenomRatio_) {
      console.error(`convertDenomRatio_ is null(denomString_: ${denomString_})`)
      return
    }
    const existBetLvCount_ = checkDenomRatioByBetLevelListMap_.get(convertDenomRatio_)
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

  const array_ = denomIdxArray_.split(",")
  if (array_.length >= 2) {
    defaultDenomIdx_ = array_[1]
  } else {
    defaultDenomIdx_ = array_[0]
  }

  const defaultDenomString_ = convertDenomIdxToDenomStr(defaultDenomIdx_)

  console.log(
    clc.magenta(`cryDef=${cryDef} minBet_=${minBet_} `) +
      clc.red(minBetDenomStrArray_) +
      "," +
      denomIdxArray_ +
      " default:" +
      defaultDenomIdx_ +
      `(${defaultDenomString_})`
  )
  //@note 【舊】寫入 denom 設定值
  excelMinBetOutput_.push([
    cryDef,
    minBet_,
    ...minBetDenomStrArray_,
    denomIdxArray_,
    defaultDenomIdx_,
    defaultDenomString_,
    array_.length,
  ])

  denomIdxByMinBetListMap_.set(minBet_, denomIdxArray_)

  const arr_ = denomIdxArray_.split(",")
  if (arr_.length >= 2) {
    defaultDenomIdxByMinBetListMap_.set(minBet_, arr_[1])
  } else {
    defaultDenomIdxByMinBetListMap_.set(minBet_, arr_[0])
  }

  /**
   * 最大範圍的面額索引陣列 1...
   */
  let maxRangeMinBetDenomList = []
  let maxDenomIdxArray_ = ""
  calculateMaxDenomIdxArray(maxRangeMinBetDenomList, maxRangeMinBetDenom_, maxDenomIdxArray_)

  //寫入 Excel 最大面額範圍
  excelMinBetOutput_.push([cryDef, "MaxRangeDenom", ...maxRangeMinBetDenomList, maxDenomIdxArray_])

  console.log(
    clc.magenta(`cryDef=${cryDef} minBet_="MaxRangeDenom" `) +
      clc.red(maxRangeMinBetDenomList) +
      "," +
      maxDenomIdxArray_
  )
}

function calculateMaxDenomIdxArray(maxRangeMinBetDenomList, maxRangeMinBetDenom_, maxDenomIdxArray_) {
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
}

export function calculateBetLevelList(minBet_, cryDef, checkDenomRatioByBetLevelListMap_) {
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
        const existDenomRatio_ = checkDenomRatioByBetLevelListMap_.get(denomRatio_)
        let minBetDenomCount = 1
        if (existDenomRatio_) {
          minBetDenomCount += existDenomRatio_
        }
        checkDenomRatioByBetLevelListMap_.set(denomRatio_, minBetDenomCount)
      }
    })
  })
}

import clc = require("cli-color")

import { minBetList, denomTitleLIst, denomIndexTitleList } from "./data"
import { writeSinglePageExcel } from "./excel"
import { processSQL } from "./sql"
import { calculate, calculateBetLevelList } from "./calculate"
import { findTable } from "./findTable"

/**
 * 主迴圈
 *
 * @param targetCurrency
 * @param cryDef
 */
export function mainLoop(targetCurrency: string, cryDef: number, isCalculate: boolean) {
  /**
   * Excel 的輸出資料陣列
   */
  const excelMinBetOutput_ = []

  //Excel標題
  excelMinBetOutput_.push([
    "cryDef",
    "minBet",
    ...denomTitleLIst,
    "denomIndex",
    "defaultDenomIndex",
    "defaultDenomIndexString",
    "count",
  ])
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
    const checkDenomRatioByBetLevelListMap_ = new Map()

    calculateBetLevelList(minBet_, cryDef, checkDenomRatioByBetLevelListMap_)

    console.log("================================================")

    //@note 儲存 EXCEL 格式的 denom
    const minBetDenomStrArray_ = []

    let denomIdxArray_ = ""
    if (isCalculate) {
      calculate(
        cryDef,
        minBet_,
        excelMinBetOutput_,
        minBetDenomStrArray_,
        checkDenomRatioByBetLevelListMap_,
        maxRangeMinBetDenom_,
        denomIdxArray_,
        denomIdxByMinBetListMap_,
        defaultDenomIdxByMinBetListMap_
      )
    } else {
      findTable(
        minBet_,
        cryDef,
        targetCurrency,
        minBetDenomStrArray_,
        excelMinBetOutput_,
        denomIdxArray_,
        denomIdxByMinBetListMap_,
        defaultDenomIdxByMinBetListMap_
      )
    }
  })

  writeSinglePageExcel(`./output/minBet_${targetCurrency}.xlsx`, "minBetSheet", excelMinBetOutput_)

  //SQL
  processSQL(targetCurrency, denomIdxByMinBetListMap_, defaultDenomIdxByMinBetListMap_)
}

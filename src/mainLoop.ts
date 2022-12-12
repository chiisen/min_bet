import clc = require("cli-color")

const { data, excel } = require("58-toolkit")
const { minBetList, denomTitleLIst, denomIndexTitleList } = data
const { writeSinglePageExcel } = excel

import { processSQL } from "./sql"
import { calculate, calculateBetLevelList } from "./calculate"
import { findTable } from "./findTable"
import { checkDenom } from "./checkDenom"

/**
 *
 */
export function mainLoopAllDC(targetCurrency: string, cryDef: number, path: string, allSql: string, hallId: string) {
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

    //console.log(`【minBet: ${minBet_}】================================================`)

    //@note 儲存 EXCEL 格式的 denom
    const minBetDenomStrArray_ = []

    let denomIdxArray_ = ""
    //一般是讀表，因為表格有很多人為填寫的例外操作
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
  })

  writeSinglePageExcel(`./output/${path}/minBet_${targetCurrency}.xlsx`, "minBetSheet", excelMinBetOutput_)

  //SQL
  allSql = processSQL(targetCurrency, denomIdxByMinBetListMap_, defaultDenomIdxByMinBetListMap_, path, allSql, hallId)

  //檢查指定幣別的所有遊戲 denom 設定與 I8 的關係
  //checkDenom(targetCurrency)

  return allSql
}

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

    //console.log(`【minBet: ${minBet_}】================================================`)

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
      //一般是讀表，因為表格有很多人為填寫的例外操作
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
  processSQL(targetCurrency, denomIdxByMinBetListMap_, defaultDenomIdxByMinBetListMap_, null, null, null)

  //檢查指定幣別的所有遊戲 denom 設定與 I8 的關係
  checkDenom(targetCurrency)
}

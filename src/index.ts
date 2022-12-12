import clc = require("cli-color")
import fs = require("fs")
import dotenv = require("dotenv")
const { file } = require("58-toolkit")
const { emptyDir, writeAlter } = file

import { initI8Denom } from "./i8Denom"
import { initGameDenom } from "./gameDenom"
import { initFunkyDenom } from "./funkyDenom"
import { initTyBoiDenom } from "./tyBoiDenom"
import { mainLoop, mainLoopAllDC } from "./mainLoop"

import { initMinBetMainLoop } from "./minBet"
import { initCurrencyList, currencyList, currencyDataList } from "./currencyList"
import { initAllDCCurrencies, allDCCurrenciesMap } from "./AllDCCurrencies"
import { initHallName } from "./hallName"
import { initHallSetting } from "./hallSetting"

const envFile = ".env"
if (!fs.existsSync(".env")) {
  console.error(clc.red(`\n 讀檔失敗，找不到 ${envFile}`))
  process.exit(1)
}

dotenv.config()

console.log("ENV: " + process.env["ENV"]) //ENV

export const default_denom_1by1 = /true/i.test(process.env["DEFAULT_DENOM_1BY1"])
console.log("DEFAULT_DENOM_1BY1: " + default_denom_1by1) //DEFAULT_DENOM_1BY1

/**
 * 單元測試用
 *
 * @param name 名子
 * @returns
 */
export function hello(name: string): string {
  return `Hello ${name}`
}

/**
 * 清空輸出資料夾
 */
emptyDir(`./output`)

const excelInputFileName = "./input/匯率表.xlsx"
const excelMinBetInputFileName = "./input/minBet.xlsx"
const excelGameMinBetInputFileName = "./input/gameMinBet.xlsx"
const excelI8DenomInputFileName = "./input/i8_game_denom_setting.xlsx"
const excelGameDenomInputFileName = "./input/game_currency_denom_setting.xlsx"
const excelFunkyDenomInputFileName = "./input/FUNKY_DENOM.xlsx"
const excelAllDCCurrenciesInputFileName = "./input/AllDCCurrencies.xlsx"
const excelHallNameInputFileName = "./input/HALL_NAME.xlsx"
const excelHallSettingInputFileName = "./input/denom特化統整表.xlsx"

/**
 * 特別檢查 USD 的 minBet 是否小於 0.05
 */
const excelTyBoiDenomInputFileName = "./input/PROD_TyBoi.xlsx"

/**
 * 一般都是讀表來進行設定denom(此值為false)
 * 因為設定內容沒有100%遵守公式
 * 加入了很多的人為設定
 *
 * 除了要新增全新的幣別，改為true
 * 可以幫你建立計算好的EXCEL與SQL腳本
 */
export const isCalculate = /true/i.test(process.env["IS_CALCULATE"])
console.log("IS_CALCULATE: " + isCalculate) //IS_CALCULATE

/**
 * 是否匯出所有HALL的幣別設定
 */
export const isAllDCCurrencies = /true/i.test(process.env["IS_ALL_DC_CURRENCIES"])
console.log("IS_ALL_DC_CURRENCIES: " + isAllDCCurrencies) //IS_ALL_DC_CURRENCIES

initCurrencyList(excelInputFileName)

if (!isCalculate) {
  initMinBetMainLoop(currencyList, excelMinBetInputFileName, excelGameMinBetInputFileName)

  /**
   * 特別檢查 USD 的 minBet 是否小於 0.05
   */
  //initTyBoiDenom(excelTyBoiDenomInputFileName)

  /**
   * 載入 I8 的 Denom 設定
   */
  initI8Denom(excelI8DenomInputFileName)

  initGameDenom(excelGameDenomInputFileName)

  initFunkyDenom(excelFunkyDenomInputFileName)
}

if (isAllDCCurrencies) {
  initHallSetting(excelHallSettingInputFileName)

  initHallName(excelHallNameInputFileName)

  initAllDCCurrencies(excelAllDCCurrenciesInputFileName)

  let totalAllSql_ = ""
  allDCCurrenciesMap.forEach((row) => {
    console.log(`DC: ${clc.red(row.dc)} - Cid: ${clc.green(row.hallId)} - Currencies: ${clc.yellow(row.currencies)}`)
    const currenciesArray_ = row.currencies.split(",")

    let allSql_ = ""

    let path_ = ""
    if (row.patch) {
      row.patch.forEach((x) => {
        path_ += `${x}/`
      })

      path_ += `${row.dc}/`
    }
    else{
      console.error(`路徑不存在 dc: ${row.dc}`)
    }
    currenciesArray_.forEach((x) => {
      const findCurrency_ = currencyDataList.find(function (item, index, array) {
        return item.currency === x
      })

      allSql_ = mainLoopAllDC(findCurrency_.currency, findCurrency_.cryDef, path_, allSql_, row.hallId)
    })
    writeAlter(`./output/${path_}`, allSql_, `all_${row.dc}_alter.sql`)

    totalAllSql_ += allSql_
  })

  writeAlter(`./output/`, totalAllSql_, `total_all_alter.sql`)
} else {
  currencyDataList.forEach((row) => {
    console.log(`${row.currency}-${row.cryDef}-${row.desc}`)

    if (row.cryDef != "匯率") {
      mainLoop(row.currency, row.cryDef, isCalculate)
    }
  })
}

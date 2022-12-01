import clc = require("cli-color")
import fs = require("fs")
import dotenv = require("dotenv")
const { file } = require("58-toolkit")
const { emptyDir } = file

import { initI8Denom } from "./i8Denom"
import { initGameDenom } from "./gameDenom"
import { initFunkyDenom } from "./funkyDenom"
import { initTyBoiDenom } from "./tyBoiDenom"
import { mainLoop } from "./mainLoop"

import { initMinBetMainLoop } from "./minBet"
import { initCurrencyList, currencyList, currencyDataList } from "./currencyList"

const envFile = ".env"
if (!fs.existsSync(".env")) {
  console.error(clc.red(`\n 讀檔失敗，找不到 ${envFile}`))
  process.exit(1)
}

dotenv.config()

console.log("ENV: " + process.env["ENV"]) //ENV

export const default_denom_1by1 = /true/i.test(process.env["DEFAULT_DENOM_1BY1"])
console.log("DEFAULT_DENOM_1BY1: " + process.env["DEFAULT_DENOM_1BY1"]) //DEFAULT_DENOM_1BY1
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

/**
 * 特別檢查 USD 的 minBet 是否小於 0.05
 */
const excelTyBoiDenomInputFileName = "./input/PROD_TyBoi.xlsx"

initCurrencyList(excelInputFileName)

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

currencyDataList.forEach((row) => {
  console.log(`${row.currency}-${row.cryDef}-${row.desc}`)

  if (row.cryDef != "匯率") {
    const isCalculate = false //一般都是讀表(此值為false)，因為表格有很多人為填寫的例外操作
    mainLoop(row.currency, row.cryDef, isCalculate)
  }
})

import clc = require("cli-color")
import fs = require("fs")
import dotenv = require("dotenv")
const { file } = require("58-toolkit")
const { emptyDir } = file

import { initI8Denom } from "./i8Denom"
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

initMinBetMainLoop(currencyList, excelMinBetInputFileName, excelGameMinBetInputFileName)

/**
 * 載入 I8 的 Denom 設定
 */
initI8Denom(excelI8DenomInputFileName)

initCurrencyList(excelInputFileName)

currencyDataList.forEach((row) => {
  console.log(`${row.currency}-${row.cryDef}-${row.desc}`)

  if (row.cryDef != "匯率") {
    const isCalculate = false //一般都是讀表(此值為false)，因為表格有很多人為填寫的例外操作
    mainLoop(row.currency, row.cryDef, isCalculate)
  }
})

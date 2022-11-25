import clc = require("cli-color")
import fs = require("fs")
import dotenv = require("dotenv")
const { file } = require("58-toolkit")
const { emptyDir } = file

import { getExcel } from "./excel"

import { mainLoop } from "./mainLoop"

import { minBet } from "./minBet"

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
 *
 * @param name 單元測試用
 * @returns
 */
export function hello(name: string): string {
  return `Hello ${name}`
}

emptyDir(`./output`)

const excelInputFileName = "./input/匯率表.xlsx"
const excelMinBetInputFileName = "./input/minBet.xlsx"
const excelGameMinBetInputFileName = "./input/gameMinBet.xlsx"

const exchangeRateSheet = getExcel(excelInputFileName, false, "匯率表")

const currencyList = []

exchangeRateSheet.forEach((row) => {
  const currency = row[0]
  const cryDef = row[1]
  if (cryDef != "匯率") {
    currencyList.push(currency)
  }
})

minBet(currencyList, excelMinBetInputFileName, excelGameMinBetInputFileName)

exchangeRateSheet.forEach((row) => {
  const currency = row[0]
  const cryDef = row[1]
  const desc = row[2]

  console.log(`${currency}-${cryDef}-${desc}`)

  if (cryDef != "匯率") {
    const isCalculate = false //一般都是讀表(此值為false)，因為表格有很多人為填寫的例外操作
    mainLoop(currency, cryDef, isCalculate)
  }
})

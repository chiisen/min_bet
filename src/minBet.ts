import clc = require("cli-color")

const { excel, convert } = require("58-toolkit")
const { getExcel } = excel
const { convertExcelToExcelDenomList, convertExcelToDenomList } = convert

/**
 * key: minBet 與 currency 回傳 EXCEL 格式的 denom
 */
export const minBetToExcelDenomListMap = new Map()

/**
 * key: gameId 與 currency 回傳 EXCEL 格式的 denom
 */
export const gameIdCurrencyToExcelDenomListMap = new Map()

/**
 * key: minBetId 與 currency 回傳第幾個 denom
 */
export const minBetCurrencyToDefaultDenomNthMap = new Map()

/**
 * 輸入 gameId 回傳 minBet
 */
export const gameIdMinBetMap = new Map()

/**
 * 取得 gameId 的 default denom index
 *
 * @param gameId
 * @param currency
 * @returns
 */
export function getDefaultMinBetDenomIndex(gameId, currency) {
  const minBet_ = gameIdMinBetMap.get(gameId)
  const keyMinBetIdCurrency_ = `${minBet_}-${currency}`
  const defaultDenomNth_ = minBetCurrencyToDefaultDenomNthMap.get(keyMinBetIdCurrency_)
  const defaultDenomIndexNth_ = defaultDenomNth_ - 1
  const excelDenomList_ = minBetToExcelDenomListMap.get(keyMinBetIdCurrency_)
  if (!excelDenomList_) {
    return null
  }
  const denomList_ = convertExcelToDenomList(excelDenomList_)
  if (!denomList_) {
    return null
  }
  const defaultMinBetDenomIndex_ = denomList_[defaultDenomIndexNth_]
  return defaultMinBetDenomIndex_
}

/**
 *
 * @param currencyList
 * @param excelMinBetInputFileName
 * @param excelGameMinBetInputFileName
 */
export function initMinBetMainLoop(currencyList, excelMinBetInputFileName, excelGameMinBetInputFileName) {
  initAllMinBets(excelMinBetInputFileName)

  const gameMinBet_ = getExcel(excelGameMinBetInputFileName, false, "MIN_BET")

  gameMinBet_.forEach((row) => {
    const gameId_ = row[0]
    const minBet_ = row[3]

    if (gameId_ != "gameId") {
      gameIdMinBetMap.set(gameId_, minBet_)

      currencyList.forEach((cur) => {
        const keyMinBetCurrency_ = `${minBet_}-${cur}`
        const excelDenomList_ = minBetToExcelDenomListMap.get(keyMinBetCurrency_)
        if (excelDenomList_) {
          const keyGameIdCurrency_ = `${gameId_}-${cur}`
          if (gameIdCurrencyToExcelDenomListMap.get(keyGameIdCurrency_)) {
            console.log(`${gameId_}-${cur} 重複了`)
          }
          gameIdCurrencyToExcelDenomListMap.set(keyGameIdCurrency_, excelDenomList_)
        } else {
          console.log(`${gameId_}-${cur} 找不到`)
        }
      })
    }
  })
}

/**
 *
 * @param excelMinBetInputFileName
 */
function initAllMinBets(excelMinBetInputFileName) {
  const minBet1_ = getExcel(excelMinBetInputFileName, false, "minBet_1")
  initMinBet(1, minBet1_)
  const minBet3_ = getExcel(excelMinBetInputFileName, false, "minBet_3")
  initMinBet(3, minBet3_)
  const minBet5_ = getExcel(excelMinBetInputFileName, false, "minBet_5")
  initMinBet(5, minBet5_)
  const minBet9_ = getExcel(excelMinBetInputFileName, false, "minBet_9")
  initMinBet(9, minBet9_)
  const minBet10_ = getExcel(excelMinBetInputFileName, false, "minBet_10")
  initMinBet(10, minBet10_)
  const minBet15_ = getExcel(excelMinBetInputFileName, false, "minBet_15")
  initMinBet(15, minBet15_)
  const minBet20_ = getExcel(excelMinBetInputFileName, false, "minBet_20")
  initMinBet(20, minBet20_)
  const minBet25_ = getExcel(excelMinBetInputFileName, false, "minBet_25")
  initMinBet(25, minBet25_)
  const minBet30_ = getExcel(excelMinBetInputFileName, false, "minBet_30")
  initMinBet(30, minBet30_)
  const minBet40_ = getExcel(excelMinBetInputFileName, false, "minBet_40")
  initMinBet(40, minBet40_)
  const minBet50_ = getExcel(excelMinBetInputFileName, false, "minBet_50")
  initMinBet(50, minBet50_)
  const minBet88_ = getExcel(excelMinBetInputFileName, false, "minBet_88")
  initMinBet(88, minBet88_)
}

/**
 *
 * @param minBetId
 * @param minBetSheet
 */
function initMinBet(minBetId, minBetSheet) {
  minBetSheet.forEach((row) => {
    const currency = row[0]
    const cryDef = row[1]
    const desc = row[2]

    if (currency && cryDef != "不支援") {
      const excelDenomArray_ = [
        row[3], //29 1:100000
        row[4], //28 1:50000
        row[5],
        row[6],
        row[7],
        row[8],
        row[9],
        row[10],
        row[11],
        row[12],
        row[13],
        row[14],
        row[15],
        row[16],
        row[17],
        row[18],
        row[19],
        row[20],
        row[21],
        row[22],
        row[23],
        row[24],
        row[25],
        row[26],
        row[27],
        row[28],
        row[29],
        row[30], //2 50000:1
        row[31], //1 100000:1
      ]

      const defaultDenomNth_ = row[32] //第幾個denom

      const keyDefaultMinBetCurrency_ = `${minBetId}-${currency}`
      if (defaultDenomNth_ === 0) {
        minBetCurrencyToDefaultDenomNthMap.set(keyDefaultMinBetCurrency_, 1)
      } else {
        minBetCurrencyToDefaultDenomNthMap.set(keyDefaultMinBetCurrency_, defaultDenomNth_)
      }

      const excelDenomList_ = convertExcelToExcelDenomList(excelDenomArray_)

      const keyMinBetIdCurrency_ = `${minBetId}-${currency}`
      if (minBetToExcelDenomListMap.get(keyMinBetIdCurrency_)) {
        console.log(`key_: ${keyMinBetIdCurrency_}-重複了`)
      }
      minBetToExcelDenomListMap.set(keyMinBetIdCurrency_, excelDenomList_)
    }
  })
}

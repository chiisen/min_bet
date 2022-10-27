import { getExcel } from "./excel"

export const minBetToExcelDenomListMap = new Map()
export const gameIdAndCurrencyToExcelDenomListMap = new Map()
export const minBetCurrencyToDefaultDenomMap = new Map()
export const minBetCurrencyToDefaultDenomIdxMap = new Map()

export function minBet(currencyList, excelMinBetInputFileName, excelGameMinBetInputFileName) {
  initAllMinBets(excelMinBetInputFileName)

  const minBet_ = getExcel(excelGameMinBetInputFileName, false, "MIN_BET")

  minBet_.forEach((row) => {
    const gameId = row[0]
    const minBet = row[3]

    if (gameId != "gameId") {
      currencyList.forEach((c) => {
        const key_ = `${minBet}-${c}`
        const excelDenomList_ = minBetToExcelDenomListMap.get(key_)
        if (excelDenomList_) {
          const key2_ = `${gameId}-${c}`
          if (gameIdAndCurrencyToExcelDenomListMap.get(key2_)) {
            console.log(`${gameId}-${c} 重複了`)
          }
          gameIdAndCurrencyToExcelDenomListMap.set(key2_, excelDenomList_)
        } else {
          console.log(`${gameId}-${c} 找不到`)
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

      const default_ = row[32]
      const denomList_ = convertExcelToDenomList(excelDenomArray_)

      const defKey_ = `${minBetId}-${currency}`
      if (default_ === 0) {
        minBetCurrencyToDefaultDenomMap.set(defKey_, denomList_[0])
        minBetCurrencyToDefaultDenomIdxMap.set(defKey_, 1)
      } else {
        const defIdx_ = default_ - 1
        minBetCurrencyToDefaultDenomMap.set(defKey_, denomList_[defIdx_])
        minBetCurrencyToDefaultDenomIdxMap.set(defKey_, default_)
      }

      const excelDenomList_ = convertExcelToExcelDenomList(excelDenomArray_)

      const key_ = `${minBetId}-${currency}`
      if (minBetToExcelDenomListMap.get(key_)) {
        console.log(`key_: ${key_}-重複了`)
      }
      minBetToExcelDenomListMap.set(key_, excelDenomList_)
    }
  })
}

/**
 * EXCEL 轉成 denom 陣列
 *
 * @param denomArray 要EXCEL的資料才行
 * @returns
 */
function convertExcelToDenomList(denomArray) {
  const denomList_ = []
  let denomIdx_ = 1
  denomArray.forEach((r) => {
    if (r) {
      denomList_.push(denomIdx_)
    }
    denomIdx_++
  })
  return denomList_
}

/**
 * EXCEL 轉成 EXCEL 格式的 denom 陣列
 *
 * @param excelDenomArray 要EXCEL的資料才行
 * @returns
 */
function convertExcelToExcelDenomList(excelDenomArray) {
  const denomList_ = []
  let denomIdx_ = 29
  excelDenomArray.forEach((r) => {
    if (r) {
      denomList_.push(denomIdx_)
    } else {
      denomList_.push("")
    }
    denomIdx_--
  })
  return denomList_
}

/**
 * EXCEL 轉成 denom 字串
 *
 * @param denomArray 要EXCEL的資料才行
 * @returns
 */
function convertExcelToDenomString(denomArray) {
  let denomIdx_ = 29
  let denomIdxsString_ = ""
  denomArray.forEach((r) => {
    if (r) {
      if (denomIdxsString_ === "") {
        denomIdxsString_ += denomIdx_.toString()
      } else {
        denomIdxsString_ += "," + denomIdx_.toString()
      }
    }
    denomIdx_--
  })
  return denomIdxsString_
}

/**
 * 陣列轉成 denom 字串
 * @param denomArray
 * @returns
 */
function convertListToDenomString(denomArray) {
  let denomIdxsString_ = ""
  denomArray.forEach((r) => {
    if (r) {
      if (denomIdxsString_ === "") {
        denomIdxsString_ += r.toString()
      } else {
        denomIdxsString_ += "," + r.toString()
      }
    }
  })
  return denomIdxsString_
}

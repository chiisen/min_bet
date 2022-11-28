const { data } = require("58-toolkit")
const { mergeSortArray } = data

import { convertDenomIdxToDenomStr } from "./helpers"
import { minBetToExcelDenomListMap, minBetCurrencyToDefaultDenomNthMap, gameIdMinBetMap } from "./minBet"
import { default_denom_1by1 } from "./index"
import { i8DenomMap } from "./i8Denom"

export function findTable(
  minBet_,
  cryDef,
  targetCurrency,
  minBetDenomStrArray_,
  excelMinBetOutput_,
  denomIdxArray_,
  denomIdxByMinBetListMap_,
  defaultDenomIdxByMinBetListMap_
) {
  let defaultDenomIdx_ = ""
  const keyMinBetCurrency_ = `${minBet_}-${targetCurrency}`
  const excelDenomList_ = minBetToExcelDenomListMap.get(keyMinBetCurrency_)
  //判斷 denom 預設是否為 1:1
  if (default_denom_1by1) {
    const denom_1by1_index_ = 15 - 1 //索引為14(陣列由 0 開始)
    if (excelDenomList_[denom_1by1_index_] === ``) {
      excelDenomList_[denom_1by1_index_] = 15
    }
  }
  const excelDenomStringList_ = []
  denomIdxArray_ = ""
  const denomList_ = []
  excelDenomList_.forEach((x) => {
    if (x) {
      const denomString_ = convertDenomIdxToDenomStr(x)
      excelDenomStringList_.push(denomString_)

      if (denomIdxArray_ === "") {
        denomIdxArray_ += x.toString()
      } else {
        denomIdxArray_ += "," + x.toString()
      }

      denomList_.push(x)
    } else {
      excelDenomStringList_.push("")
    }
  })

  minBetDenomStrArray_.push(...excelDenomStringList_)

  const keyDefaultMinBetCurrency_ = `${minBet_}-${targetCurrency}`
  const defaultDenomNth_ = minBetCurrencyToDefaultDenomNthMap.get(keyDefaultMinBetCurrency_)
  //判斷 denom 預設是否為 1:1
  if (default_denom_1by1) {
    defaultDenomIdx_ = `15` // 預設為 1:1
  } else {
    const defaultDenomNthIndex_ = defaultDenomNth_ - 1

    defaultDenomIdx_ = denomList_[defaultDenomNthIndex_]
  }

  const defaultDenomString_ = convertDenomIdxToDenomStr(defaultDenomIdx_)

  //@note 【新】寫入 denom 設定值

  gameIdMinBetMap.forEach((v, gameId_) => {
    const keyGameIdCurrency_ = `${gameId_}-${targetCurrency}`
    const i8_ = i8DenomMap.get(keyGameIdCurrency_)
    //I8 必須要包含 denomIdxArray_
    if (i8_) {
      const i8ToString_ = `${i8_.denom}`
      const i8DenomList_ = i8ToString_.split(",")
      const denomList_ = denomIdxArray_.split(",")
      if (!mergeSortArray(i8DenomList_, denomList_, `include`)) {
        let overRange_ = []
        denomList_.forEach((x) => {
          let notInclude_ = true
          i8DenomList_.forEach((y) => {
            if (x === y) {
              notInclude_ = false
            }
          })
          if(notInclude_){
            overRange_.push(x)
          }
        })

        let overRangeString_ = ""
        overRange_.forEach((x) => {
          overRangeString_ += x.toString() + ','
        })

        console.warn(`${gameId_} ${targetCurrency} ${denomIdxArray_} 不在 I8 設定範圍內 ${i8ToString_}\n超出 I8 設定: ${overRangeString_}`)
      }
    } else {
      console.warn(`gameId: ${gameId_} currency: ${targetCurrency} I8 沒有資料`)
    }
  })

  excelMinBetOutput_.push([
    cryDef,
    minBet_,
    ...minBetDenomStrArray_,
    denomIdxArray_,
    defaultDenomIdx_,
    defaultDenomString_,
    `defaultDenomNth_: ${defaultDenomNth_} / Count: ${denomList_.length}`,
  ])

  denomIdxByMinBetListMap_.set(minBet_, denomIdxArray_)

  defaultDenomIdxByMinBetListMap_.set(minBet_, defaultDenomIdx_)
}

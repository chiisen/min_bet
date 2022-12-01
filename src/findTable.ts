import { convertDenomIdxToDenomStr } from "./helpers"
import { minBetToExcelDenomListMap, minBetCurrencyToDefaultDenomNthMap } from "./minBet"
import { default_denom_1by1 } from "./index"

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
  if(!excelDenomList_){
    console.error(`找不到 ${keyMinBetCurrency_} 的資料`)
    return
  }
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

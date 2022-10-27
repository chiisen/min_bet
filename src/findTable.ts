import { convertDenomIdxToDenomStr } from "./helpers"
import { minBetToExcelDenomListMap, minBetCurrencyToDefaultDenomIdxMap } from "./minBet"

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
  const key_ = `${minBet_}-${targetCurrency}`
  const excelDenomList_ = minBetToExcelDenomListMap.get(key_)
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

  if (denomList_.length >= 2) {
    defaultDenomIdx_ = denomList_[1]
  } else {
    defaultDenomIdx_ = denomList_[0]
  }

  const defaultDenomString_ = convertDenomIdxToDenomStr(defaultDenomIdx_)

  //@note 【新】寫入 denom 設定值
  const defKey_ = `${minBet_}-${targetCurrency}`
  const default_ = minBetCurrencyToDefaultDenomIdxMap.get(defKey_)
  excelMinBetOutput_.push([
    cryDef,
    minBet_,
    ...minBetDenomStrArray_,
    denomIdxArray_,
    defaultDenomIdx_,
    defaultDenomString_,
    `default_: ${default_} / Count: ${denomList_.length}`,
  ])

  denomIdxByMinBetListMap_.set(minBet_, denomIdxArray_)

  if (denomList_.length >= 2) {
    defaultDenomIdxByMinBetListMap_.set(minBet_, denomList_[1])
  } else {
    defaultDenomIdxByMinBetListMap_.set(minBet_, denomList_[0])
  }
}

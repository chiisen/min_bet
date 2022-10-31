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
  const keyMinBetCurrency_ = `${minBet_}-${targetCurrency}`
  const excelDenomList_ = minBetToExcelDenomListMap.get(keyMinBetCurrency_)
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
  const defaultDenomNth_ = minBetCurrencyToDefaultDenomIdxMap.get(keyDefaultMinBetCurrency_)
  const defaultDenomNthIndex_ = defaultDenomNth_ - 1

  defaultDenomIdx_ = denomList_[defaultDenomNthIndex_]

  const defaultDenomString_ = convertDenomIdxToDenomStr(defaultDenomIdx_)

  //@note 【新】寫入 denom 設定值  
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

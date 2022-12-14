import { minBetToExcelDenomListMap, minBetCurrencyToDefaultDenomNthMap } from "./minBet"
import { hallSettingMap } from "./hallSetting"
import { currency1By1Map } from "./currency1By1"
import { funkyDenomMapByMinBet } from "./funkyDenom"
import { unwatchFile } from "fs"

const { data } = require("58-toolkit")
const { denomIndexToDenomString } = data

export function findTable(
  minBet_,
  cryDef,
  targetCurrency,
  minBetDenomStrArray_,
  excelMinBetOutput_,
  denomIdxArray_,
  denomIdxByMinBetListMap_,
  defaultDenomIdxByMinBetListMap_,
  hallId,
  dc
) {
  let defaultDenomIdx_ = ""
  const keyMinBetCurrency_ = `${minBet_}-${targetCurrency}`
  const excelDenomList_ = minBetToExcelDenomListMap.get(keyMinBetCurrency_)
  if (!excelDenomList_) {
    console.error(`找不到 ${keyMinBetCurrency_} 的資料`)
    return
  }
  const excelDenomListTemp_ = [...excelDenomList_]
  //判斷 denom 預設是否為 1:1
  let hallSettingData_
  const c1By1_ = currency1By1Map.get(targetCurrency)
  if (dc) {
    hallSettingData_ = hallSettingMap.get(dc)
    if (hallSettingData_ && hallSettingData_.normal_1By1) {
      const denom_1by1_index_ = 15 - 1 //索引為14(陣列由 0 開始)
      if (excelDenomListTemp_[denom_1by1_index_] === ``) {
        excelDenomListTemp_[denom_1by1_index_] = 15
      }
    }

    if (dc === "I8" || dc === "AOA_Hall" /* @note 有特例開放 1:1 時, I8 必須打開 1:1 */) {
      // @note I8 與 AOA 特化
      const keyMinBetCurrency_ = `${minBet_}-${targetCurrency}`
      const funkyDenomData_ = funkyDenomMapByMinBet.get(keyMinBetCurrency_)
      if (funkyDenomData_) {
        console.log(
          `dc: ${dc} minBet: ${funkyDenomData_.minBet} denom: ${funkyDenomData_.denom}  defaultDenomId: ${funkyDenomData_.defaultDenomId} currency: ${targetCurrency}`
        )
      } else {
        console.warn(`dc: ${dc} - FUNKY 沒有 MinBet-Currency: ${minBet_}-${targetCurrency} 的資料`)
      }
      if (c1By1_) {
        const denom_1by1_index_ = 15 - 1 //索引為14(陣列由 0 開始)
        if (excelDenomListTemp_[denom_1by1_index_] === ``) {
          excelDenomListTemp_[denom_1by1_index_] = 15
        }
      }
    }
  }

  const excelDenomStringList_ = []
  denomIdxArray_ = ""
  const denomList_ = []
  excelDenomListTemp_.forEach((x) => {
    if (x) {
      const denomString_ = denomIndexToDenomString(x)
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
  if (hallSettingData_ && hallSettingData_.normal_1By1) {
    defaultDenomIdx_ = `15` // 預設為 1:1
  } else {
    const defaultDenomNthIndex_ = defaultDenomNth_ - 1

    if (defaultDenomNthIndex_ >= denomList_.length) {
      console.error(
        `keyDefaultMinBetCurrency_: ${keyDefaultMinBetCurrency_} 超出陣列範圍 defaultDenomNthIndex_: ${defaultDenomNthIndex_}`
      )
    }
    defaultDenomIdx_ = denomList_[defaultDenomNthIndex_]
  }

  if (dc === "I8" || dc === "AOA_Hall" /* @note 有特例開放 1:1 時, I8 必須打開預設 1:1 */) {
    // @note I8 與 AOA 特化
    if (c1By1_) {
      defaultDenomIdx_ = `15` // 預設為 1:1
    }
  }

  const defaultDenomString_ = denomIndexToDenomString(defaultDenomIdx_)

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

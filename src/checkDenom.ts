import clc = require("cli-color")

const { data, file } = require("58-toolkit")
const { mergeSortArray, overRangeListString } = data
const { writeAlter } = file

import { gameIdMinBetMap, gameIdCurrencyToExcelDenomListMap, getDefaultMinBetDenomIndex } from "./minBet"
import { i8DenomMap } from "./i8Denom"
import { funkyDenomMap } from "./funkyDenom"
import { gameDenomMap } from "./gameDenom"

/**
 * @note 檢查指定幣別的所有遊戲 denom 設定與 I8 的關係
 */
export function checkDenom(targetCurrency) {
  let noDataSql_ = "use game;"

  gameIdMinBetMap.forEach((v, gameId_) => {
    const keyGameIdCurrency_ = `${gameId_}-${targetCurrency}`
    const excelDenomList_ = gameIdCurrencyToExcelDenomListMap.get(keyGameIdCurrency_)
    let denomIdxArray_ = ""

    excelDenomList_.forEach((x) => {
      if (x) {
        if (denomIdxArray_ === "") {
          denomIdxArray_ += x.toString()
        } else {
          denomIdxArray_ += "," + x.toString()
        }
      }
    })

    const i8_ = i8DenomMap.get(keyGameIdCurrency_)
    //I8 必須要包含 denomIdxArray_
    if (i8_) {
      const i8ToString_ = `${i8_.denom}`
      const i8DenomList_ = i8ToString_.split(",")
      const denomList_ = denomIdxArray_.split(",")
      if (!mergeSortArray(i8DenomList_, denomList_, `include`)) {
        let overRangeString_ = overRangeListString(denomList_, i8DenomList_)

        //@note 不在【I8】設定範圍內
        const gameDenom_ = gameDenomMap.get(keyGameIdCurrency_)
        let gameDenomString_ = clc.redBright("找不到遊戲 denom 設定")
        if (gameDenom_) {
          const gameDenomArray_ = gameDenom_.denom.toString().split(",")
          if (!mergeSortArray(i8DenomList_, gameDenomArray_, `same`)) {
            gameDenomString_ = clc.redBright(gameDenom_.denom)
          } else {
            gameDenomString_ = clc.greenBright(`同【I8】設定`)
          }
        }

        const funky_ = funkyDenomMap.get(keyGameIdCurrency_)

        console.log(
          `${clc.green(gameId_)} ${clc.redBright(targetCurrency)} ${clc.yellow(denomIdxArray_)} 不在【I8】${clc.yellow(
            i8ToString_
          )} 設定範圍內\n超出【I8】設定: ${clc.yellow(overRangeString_)}\n遊戲 denom: ${clc.redBright(
            gameDenomString_
          )}`
        )
      }
    } else {
      //@note 【I8】沒有資料
      console.log(
        `gameId: ${clc.green(gameId_)} currency: ${clc.redBright(targetCurrency)} 【I8】${clc.redBright("沒有資料")}`
      )

      const defaultMinBetDenomIndex_ = getDefaultMinBetDenomIndex(gameId_, targetCurrency)

      noDataSql_ += `\n`
      noDataSql_ += `INSERT INTO game_denom_setting (Cid,GameId,Currency,Denom,DefaultDenomId,PremadeBetGoldIdList,DefaultPremadeBetGoldId) VALUES ('d25e8rPFyBO4',${gameId_},'${targetCurrency}','${denomIdxArray_}',${defaultMinBetDenomIndex_},NULL,0);`
    }
  })

  if (noDataSql_ != "use game;") {
    writeAlter("./output/", noDataSql_, `no_data_alter_${targetCurrency}.sql`)
  }
}

import clc = require("cli-color")

const { data, file, convert, helpers } = require("58-toolkit")
const { mergeSortArray, overRangeListString } = data
const { writeAlter } = file
const { convertListToDenomString } = convert
const { addTwoDenomList, mergeSortArrayByColor } = helpers

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
    let denomListString_ = convertListToDenomString(excelDenomList_)

    const i8_ = i8DenomMap.get(keyGameIdCurrency_)
    //I8 必須要包含 denomIdxArray_
    if (i8_) {
      const i8ToString_ = `${i8_.denom}`
      let i8DenomList_ = i8ToString_.split(",")
      i8DenomList_ = i8DenomList_.sort(function (a: string, b: string) {
        return Number(b) - Number(a)
      }) //排序: 大到小
      const denomList_ = denomListString_.split(",")
      if (!mergeSortArray(i8DenomList_, denomList_, `include`)) {
        let overRangeString_ = overRangeListString(denomList_, i8DenomList_)

        //@note 不在【I8】設定範圍內
        const gameDenom_ = gameDenomMap.get(keyGameIdCurrency_)
        let gameDenomStringColor_ = clc.redBright("找不到遊戲 denom 設定")
        let gameSourceDenom_ = `${keyGameIdCurrency_} 找不到 denom`
        if (gameDenom_) {
          gameSourceDenom_ = gameDenom_.denom
          const gameDenomArray_ = gameDenom_.denom.toString().split(",")
          if (!mergeSortArray(i8DenomList_, gameDenomArray_, `same`)) {
            gameDenomStringColor_ = mergeSortArrayByColor(i8DenomList_, gameDenomArray_, clc.green, clc.redBright)
          } else {
            gameDenomStringColor_ = clc.green(`同【I8】設定`)
          }
        }

        const overRangeStringColor_ = mergeSortArrayByColor(i8DenomList_, denomList_, clc.green, clc.redBright)

        console.log(`===========================================`)
        console.log(`${clc.green(gameId_)} ${clc.yellow(targetCurrency)} ${clc.green(denomListString_)}`)
        console.log(`不在【I8】${clc.green(i8ToString_)} 設定範圍內`)
        console.log(`超出【I8】設定為(${overRangeString_}): ${overRangeStringColor_}`)
        console.log(`遊戲 denom: ${gameSourceDenom_}`)
        console.log(`遊戲 denom(超出【I8】紅色): ${gameDenomStringColor_}`)

        const funky_ = funkyDenomMap.get(keyGameIdCurrency_)
        if (funky_) {
          console.log(`【FUNKY】${clc.green(funky_.denom)}`)

          // @note FUNKY + 一般 + 1:1
          const funkyToListString_ = `${funky_.denom}`
          const funkyDenomList_ = funkyToListString_.split(",")
          const twdDenomList_ = addTwoDenomList(funkyDenomList_, denomList_)
          const twdDenomListAnd1By1_ = addTwoDenomList(twdDenomList_, [15])
          const twoDenomListAnd1By1ListString_ = convertListToDenomString(twdDenomListAnd1By1_)
          console.log(`【FUNKY】 + 【一般】+ 【1:1】 ${clc.green(twoDenomListAnd1By1ListString_)}`)
        } else {
          console.log(clc.yellowBright(`【FUNKY】沒有開放此幣別`))
        }
      }
    } else {
      console.log(
        `gameId: ${clc.green(gameId_)} currency: ${clc.redBright(targetCurrency)} 【I8】${clc.redBright("沒有資料")}`
      )

      const defaultMinBetDenomIndex_ = getDefaultMinBetDenomIndex(gameId_, targetCurrency)

      noDataSql_ += `\n`
      noDataSql_ += `INSERT INTO game_denom_setting (Cid,GameId,Currency,Denom,DefaultDenomId,PremadeBetGoldIdList,DefaultPremadeBetGoldId) VALUES ('d25e8rPFyBO4',${gameId_},'${targetCurrency}','${denomListString_}',${defaultMinBetDenomIndex_},NULL,0);`
    }
  })

  if (noDataSql_ != "use game;") {
    writeAlter("./output/", noDataSql_, `no_data_alter_${targetCurrency}.sql`)
  }
}

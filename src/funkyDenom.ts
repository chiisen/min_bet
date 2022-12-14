import clc = require("cli-color")
import console = require("console")

const { excel } = require("58-toolkit")
const { getExcel } = excel

import { gameIdMinBetMap } from "./minBet"

/**
 * FUNKY 的 denom 設定
 * key 為 gameId 與 currency 回傳 denom 設定
 */
export const funkyDenomMap = new Map()

export const funkyDenomMapByMinBet = new Map()

/**
 * 載入 I8 的 denom 設定
 */
export function initFunkyDenom(excelFunkyDenomInputFileName) {
  const funkyDenom_ = getExcel(excelFunkyDenomInputFileName, false, "FUNKY_DENOM")
  funkyDenom_.forEach((row) => {
    const gameId_ = row[1]
    const currency_ = row[2]
    const denom_ = row[3]
    const defaultDenomId_ = row[4]

    if (gameId_ != "GameId") {
      const keyGameIdCurrency_ = `${gameId_}-${currency_}`
      const funkyDenomData_ = funkyDenomMap.get(keyGameIdCurrency_)
      if (funkyDenomData_) {
        console.log(`${gameId_}-${currency_} 重複了`)
      } else {
        const payLoad_ = {
          gameId: gameId_,
          currency: currency_,
          denom: denom_,
          defaultDenomId: defaultDenomId_,
        }
        funkyDenomMap.set(keyGameIdCurrency_, payLoad_)
      }

      const minBet_ = gameIdMinBetMap.get(gameId_)
      const keyMinBetCurrency_ = `${minBet_}-${currency_}`
      const funkyDenomDataByMinBet_ = funkyDenomMapByMinBet.get(keyMinBetCurrency_)
      if (funkyDenomDataByMinBet_) {
        //console.log(`${minBet_}-${currency_} 重複了`) // 用 gameId 查 minBet 一定會重複，所以略過
      } else {
        const payLoadByMinBet_ = {
          gameId: gameId_,
          currency: currency_,
          minBet: minBet_,
          denom: denom_,
          defaultDenomId: defaultDenomId_,
        }
        funkyDenomMapByMinBet.set(keyMinBetCurrency_, payLoadByMinBet_)
      }
    }
  })
}

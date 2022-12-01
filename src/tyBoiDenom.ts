import clc = require("cli-color")
import console = require("console")

const { excel, data } = require("58-toolkit")
const { getExcel } = excel
const { denomIndexToDenomString, denomStringToDenomRatio } = data

const BN = require("bignumber.js")

import { gameIdMinBetMap } from "./minBet"

export function initTyBoiDenom(excelTyBoiDenomInputFileName) {
  const tyBoiDenom_ = getExcel(excelTyBoiDenomInputFileName, false, "TyBoi")
  tyBoiDenom_.forEach((row) => {
    const gameId_ = row[1]
    const currency_ = row[2]
    const denom_ = row[3]
    const defaultDenomId_ = row[4]

    if (gameId_ != "GameId") {
      if (!includeFish(gameId_)) {
        //排除魚機
        const minBet_ = gameIdMinBetMap.get(gameId_)
        const denomListString_ = `${denom_}`
        const denomList_ = denomListString_.split(",")
        denomList_.forEach((denomIndex_) => {
          const denomString_ = denomIndexToDenomString(denomIndex_)
          const denomRatio_ = denomStringToDenomRatio(denomString_)
          const cost_ = BN(minBet_).times(denomRatio_).toNumber()
          if (cost_ < 0.05) {
            console.log(`tyBoi gameId: ${gameId_} currency: ${currency_} denomIndex: ${denomIndex_} cost: ${cost_}`)
          }
        })
      }
    }
  })
}

/**
 * 是否是魚機
 * @param gameId
 * @returns
 */
function includeFish(gameId) {
  switch (gameId) {
    case 200531:
    case 200532:
    case 200533:
    case 200534:
    case 200535:
    case 200536:
    //
    case 10002:
    case 10003:
    case 10004:
    case 10005:
    case 10006:
    case 10007:
    case 10008:
    case 10009:
    case 10011:
    case 10012:
    case 10014:
    case 10081:
    case 10082:
    case 10083:
      return true
  }
  return false
}

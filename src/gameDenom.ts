import clc = require("cli-color")

const { excel } = require("58-toolkit")
const { getExcel } = excel

/**
 * 遊戲的 denom 設定
 * I8沒有上層，會參考遊戲的 denom 設定
 */
export const gameDenomMap = new Map()

/**
 * 載入 game 的 denom 設定
 */
export function initGameDenom(excelGameDenomInputFileName) {
  const gameDenom_ = getExcel(excelGameDenomInputFileName, false, "game_currency_denom_setting")
  gameDenom_.forEach((row) => {
    const gameId_ = row[0]
    const currency_ = row[1]
    const denom_ = row[2]

    if (gameId_ != "gameId") {
      const keyGameIdCurrency_ = `${gameId_}-${currency_}`
      const gameDenomData_ = gameDenomMap.get(keyGameIdCurrency_)
      if (gameDenomData_) {
        console.log(`${gameId_}-${currency_} 重複了`)
      } else {
        const payLoad_ = {
          gameId: gameId_,
          currency: currency_,
          denom: denom_,
        }
        gameDenomMap.set(keyGameIdCurrency_, payLoad_)
      }
    }
  })
}

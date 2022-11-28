import clc = require("cli-color")

const { excel } = require("58-toolkit")
const { getExcel } = excel

/**
 * I8 的 denom 設定
 * key 為 gameId 與 currency 回傳 denom 設定
 */
export const i8DenomMap = new Map()

/**
 * 載入 I8 的 denom 設定
 */
export function initI8Denom(excelI8DenomInputFileName) {
  const i8Denom_ = getExcel(excelI8DenomInputFileName, false, "i8_game_denom_setting")
  i8Denom_.forEach((row) => {
    const gameId_ = row[1]
    const currency_ = row[2]
    const denom_ = row[3]
    const defaultDenomId_ = row[4]

    if (gameId_ != "gameId") {
      const keyGameIdCurrency_ = `${gameId_}-${currency_}`
      const i8DenomData_ = i8DenomMap.get(keyGameIdCurrency_)
      if (i8DenomData_) {
        console.log(`${gameId_}-${currency_} 重複了`)
      } else {
        const payLoad_ = {
          gameId: gameId_,
          currency: currency_,
          denom: denom_,
          defaultDenomId: defaultDenomId_,
        }
        i8DenomMap.set(keyGameIdCurrency_, payLoad_)
      }
    }
  })
}

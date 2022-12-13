import clc = require("cli-color")

const { excel } = require("58-toolkit")
const { getExcel } = excel

export const currency1By1Map = new Map()

export function initCurrency1By1(excelInputFileName) {
  const sheet_ = getExcel(excelInputFileName, false, "Currency")
  sheet_.forEach((row_) => {
    const currency_ = row_[0]

    if (currency_ != "Currency") {
      if (currency1By1Map.get(currency_)) {
        console.log(clc.red(`currency1By1Map 有重複 currency_: ${currency_}`))
      }
      currency1By1Map.set(currency_, currency_)
    }
  })
}

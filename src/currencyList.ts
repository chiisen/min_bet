const { excel } = require("58-toolkit")
const { getExcel } = excel

export const currencyList = []
export const currencyDataList = []

export function initCurrencyList(excelInputFileName) {
  const exchangeRateSheet_ = getExcel(excelInputFileName, false, "匯率表")

  exchangeRateSheet_.forEach((row) => {
    const currency = row[0]
    const cryDef = row[1]
    const desc = row[2]

    if (cryDef != "匯率") {
      currencyList.push(currency)

      const payLoad_ = {
        currency,
        cryDef,
        desc,
      }
      currencyDataList.push(payLoad_)
    }
  })
}

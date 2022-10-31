import xlsx = require("node-xlsx")
import fs = require("fs")
import clc = require("cli-color")

/**
 * 檢查是否為數值
 * @param {*} val
 * @returns
 */
export function isNumeric(val: string): boolean {
  return /^-?\d+$/.test(val)
}

/**
 * 讀取 Excel
 *
 * @param {string} fileName
 */
export function getExcel(fileName: string, isLog = false, sheetIndex: 0 | string) {
  console.log(clc.cyan(`"${fileName}" excel-parse start`))

  const excel = []
  const sheets = xlsx.parse(fileName)
  let sheet = undefined
  const sheetIndexString = sheetIndex.toString()
  if (isNumeric(sheetIndexString)) {
    sheet = sheets[sheetIndex]
  } else {
    sheet = sheets.find((x) => x.name == sheetIndexString)
  }
  // 輸出每行內容
  sheet.data.forEach((row) => {
    // 陣列格式, 根據不同的索引取數據
    excel.push(row)
    if (isLog) {
      console.log(row)
    }
  })

  console.log(clc.cyan(`"${fileName}" excel-parse end`))
  return excel
}

/**
 * 寫入單頁 Excel 檔案
 *
 * @param {string} fileName
 * @param {string} sheetName
 * @param {object} dataArray -> 
    const dataArray = [['name', 'age']]
 */
export function writeSinglePageExcel(fileName: string, sheetName: string, dataArray: any[][]) {
  // @note dataArray 還不知道給甚麼型別
  const buffer: ArrayBuffer = xlsx.build([
    {
      name: sheetName,
      data: dataArray,
    } as any, // @note 還不知道給甚麼型別
  ])

  fs.writeFileSync(fileName, buffer as any, { flag: "w" }) // 如果文件存在，覆盖

  console.log(clc.cyan(`${fileName} 寫入成功!`))
}

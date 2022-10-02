import xlsx = require("node-xlsx")
import fs = require("fs")
import clc = require("cli-color")

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

const { excel } = require("58-toolkit")
const { getExcel } = excel

export const hallSettingMap = new Map()

export function initHallSetting(excelHallSettingInputFileName) {
  const hallSetting_ = getExcel(excelHallSettingInputFileName, false, "All")
  hallSetting_.forEach((row) => {
    const dc_ = row[0]
    const normal_ = row[3]
    const normal_1By1_ = row[4]
    const funky_ = row[5]
    const php_ = row[6]
    const vnd2_ = row[7]
    const normal_1By1_and_1000By1_ = row[8]
    const kbb_1By1_ = row[9]
    const twd_1By1_ = row[10]

    if (dc_ != "DC" && dc_ != "NULL" && dc_ != undefined) {
      // @note 有找不到 Cid，結果DC為NULL的狀況，先略過
      const keyDC_ = `${dc_}`
      const hallSettingData_ = hallSettingMap.get(keyDC_)
      if (hallSettingData_) {
        console.log(`${dc_} 重複了`)
      } else {
        const payLoad_ = {
          dc: dc_,
          normal: normal_,
          normal_1By1: normal_1By1_,
          funky: funky_,
          php: php_,
          vnd2: vnd2_,
          normal_1By1_and_1000By1: normal_1By1_and_1000By1_,
          kbb_1By1: kbb_1By1_,
          twd_1By1: twd_1By1_,
        }
        hallSettingMap.set(keyDC_, payLoad_)
      }
    }
  })
}

import clc = require("cli-color")

const { excel } = require("58-toolkit")
const { getExcel } = excel

export const hallNameMap = new Map()

export function initHallName(excelHallNameInputFileName) {
  const hallNameSheet_ = getExcel(excelHallNameInputFileName, false, "HALL_NAME")

  hallNameSheet_.forEach((row_) => {
    const cid_ = row_[0]
    const userName_ = row_[1]
    const nickName_ = row_[3]
    const upId_ = row_[10]
    const state_ = row_[21]
    const dc_ = row_[33]

    if (cid_ != "Cid") {
      const value_ = hallNameMap.get(cid_)
      if (!value_) {
        const payLoad_ = {
          cid: cid_,
          userName: userName_,
          nickName: nickName_,
          upId: upId_,
          state: state_,
          dc: dc_,
        }
        hallNameMap.set(cid_, payLoad_)
      } else {
        console.error(`ιθ€η cid: ${cid_} userName: ${userName_}`)
      }
    }
  }) // hallNameSheet_ end

  hallNameMap.forEach((x) => {
    const targetDC_ = x.dc
    let levelIcon_ = `π«`
    let levelPath_ = ""
    if (x.upId != "-1") {
      const list_ = []

      let upHall_ = hallNameMap.get(x.upId)
      while (upHall_ && upHall_.upId != "-1") {
        list_.push(`${upHall_.dc}`)
        levelPath_ += ` ${upHall_.dc} `
        //console.log(levelIcon_ + `δΎζΊ-DC: ${clc.yellow(targetDC_)} ηιε±€-DC: ${clc.yellow(levelPath_)}`)

        upHall_ = hallNameMap.get(upHall_.upId)

        levelIcon_ += `π«`
      } // while end
      const reverseList_ = list_.reverse()
      x.pathList = reverseList_
    } else {
      console.error(`δΎζΊ-DC: ${clc.yellow(targetDC_)} δΈιε§ upId ε°±ζ― "-1" (ε―θ½ζ― I8 ηι£εζδΈε±€)`)
    }
  }) // hallNameMap end
}

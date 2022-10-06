import clc = require("cli-color")
import fs = require("fs")
import dotenv = require("dotenv")

import {
  denomToRatioMap,
  betLevelList,
  minBetList,
  cryDef,
  denomToIndexMap,
  denomTitleLIst,
  denomIndexTitleList,
  ratioToDenomArrayMap,
  denomIdxToDenomStrArrayMap,
} from "./data"
import { writeSinglePageExcel } from "./excel"
import { writeAlter } from "./helpers"

const envFile = ".env"
if (!fs.existsSync(".env")) {
  console.error(clc.red(`\n 讀檔失敗，找不到 ${envFile}`))
  process.exit(1)
}

dotenv.config()

console.log("ENV: " + process.env["ENV"]) //ENV

/**
 *
 * @param name 單元測試用
 * @returns
 */
export function hello(name: string): string {
  return `Hello ${name}`
}

/**
 * Excel 的輸出資料陣列
 */
const excelMinBetOutput_ = []

//Excel標題
excelMinBetOutput_.push(["cryDef", "minBet", ...denomTitleLIst, "denomIndex"])
excelMinBetOutput_.push(["", "", ...denomIndexTitleList, ""])

/**
 * Min Bet 中的面額最大範圍區間
 *
 * key: 面額
 *
 * value: 累計次數
 */
const maxRangeMinBetDenom_ = new Map()

const denomIdxByMinBetListMap_ = new Map()
const defaultDenomIdxByMinBetListMap_ = new Map()

minBetList.map((minBet_) => {
  /**
   * Bet Level 1-10 的計次，滿 10 次面額才算是有效
   *
   * key: 面額比率
   *
   * value: Bet Level 累計次數，要 10 次才算有效
   */
  const checkDenomRatioByBetLevelListMap = new Map()

  betLevelList.map((betLevel_) => {
    if (!denomToRatioMap) {
      console.error(`denomToRatioMap is null`)
      return
    }

    /**
     * 面額【比率】陣列
     */
    const denomRatioList = Array.from(denomToRatioMap.values())

    /**
     * result_ = minBet_ * betLevel_ * denomRatio_ / cryDef 的計算結果
     */
    let result_ = 0
    denomRatioList.map((denomRatio_) => {
      result_ = (minBet_ * betLevel_ * denomRatio_) / cryDef

      //安全範圍 0.6 到 200
      if (result_ > 0.6 && result_ < 200) {
        const existDenomRatio_ = checkDenomRatioByBetLevelListMap.get(denomRatio_)
        let minBetDenomCount = 1
        if (existDenomRatio_) {
          minBetDenomCount += existDenomRatio_
        }
        checkDenomRatioByBetLevelListMap.set(denomRatio_, minBetDenomCount)

        //const denom = ratioToDenomMap.get(denomRatio_)
        //console.log(`denomRatio_:${denomRatio_} denom:"${denom}" minBetDenomCount:${minBetDenomCount}`)
      }
    })
  })

  console.log("================================================")

  /**
   * 面額索引陣列 1...
   */
  let denomIdxArray_ = ""

  checkDenomRatioByBetLevelListMap.forEach((betLevelCount_, denomRatio_) => {
    //Bet Level 累計次數，要 10 次才算有效
    if (betLevelCount_ >= 10) {
      const denom = ratioToDenomArrayMap.get(denomRatio_)
      if (!denom) {
        console.error(`denom is null(denomRatio_: ${denomRatio_})`)
        return
      }
      const denomStr = denom[0] //面額字串
      denomIdxArray_ += denomIdxArray_ === "" ? denomToIndexMap.get(denomStr) : "," + denomToIndexMap.get(denomStr)

      const existMaxDenomCount = maxRangeMinBetDenom_.get(denomStr)
      let maxDenomCount = 1
      if (existMaxDenomCount) {
        maxDenomCount += existMaxDenomCount
      }
      maxRangeMinBetDenom_.set(denomStr, maxDenomCount)
    }
  })

  const minBetDenomStrArray_ = []
  denomIndexTitleList.map((denomIdx_: string) => {
    //denomIdx 轉 denomRatio
    const denom_ = denomIdxToDenomStrArrayMap.get(denomIdx_)
    if (!denom_) {
      console.error(`denom_ is null(denomIdx_: ${denomIdx_})`)
      return
    }
    const denomString_ = denom_[0]
    const convertDenomRatio_ = denomToRatioMap.get(denomString_)
    if (!convertDenomRatio_) {
      console.error(`convertDenomRatio_ is null(denomString_: ${denomString_})`)
      return
    }
    const existBetLvCount_ = checkDenomRatioByBetLevelListMap.get(convertDenomRatio_)
    //Bet Level 累計次數，要 10 次才算有效
    if (existBetLvCount_ && existBetLvCount_ >= 10) {
      const denomSub_ = ratioToDenomArrayMap.get(convertDenomRatio_)
      if (!denomSub_) {
        console.error(`denomSub_ is null(convertDenomRatio_: ${convertDenomRatio_})`)
        return
      }
      const denomStrSub = denomSub_[0]
      minBetDenomStrArray_.push(denomStrSub)
    } else {
      minBetDenomStrArray_.push("")
    }
  }, {})

  let defaultDenomIdx = ""
  const array = denomIdxArray_.split(",")
  if (array.length >= 2) {
    defaultDenomIdx = array[1]
  } else {
    defaultDenomIdx = array[0]
  }
  console.log(
    clc.magenta(`cryDef=${cryDef} minBet_=${minBet_} `) +
      clc.red(minBetDenomStrArray_) +
      "," +
      denomIdxArray_ +
      " default:" +
      defaultDenomIdx
  )
  excelMinBetOutput_.push([cryDef, minBet_, ...minBetDenomStrArray_, denomIdxArray_])

  denomIdxByMinBetListMap_.set(minBet_, denomIdxArray_)

  const arr = denomIdxArray_.split(",")
  if (arr.length >= 2) {
    defaultDenomIdxByMinBetListMap_.set(minBet_, arr[1])
  } else {
    defaultDenomIdxByMinBetListMap_.set(minBet_, arr[0])
  }
})

/**
 * 最大範圍的面額索引陣列 1...
 */
let maxDenomIdxArray_ = ""
let maxRangeMinBetDenomList = []
denomIndexTitleList.map((denomIdx_: string) => {
  const denom_ = denomIdxToDenomStrArrayMap.get(denomIdx_)
  if (!denom_) {
    console.error(`denom_ is null(denomIdx_: ${denomIdx_})`)
    return
  }
  const denomString_ = denom_[0]
  const denomCount_ = maxRangeMinBetDenom_.get(denomString_)
  if (denomCount_ > 0) {
    maxRangeMinBetDenomList.push(denomString_)

    maxDenomIdxArray_ +=
      maxDenomIdxArray_ === "" ? denomToIndexMap.get(denomString_) : "," + denomToIndexMap.get(denomString_)
  } else {
    maxRangeMinBetDenomList.push("")
  }
})

//寫入 Excel 最大面額範圍
excelMinBetOutput_.push([cryDef, "MaxRangeDenom", ...maxRangeMinBetDenomList, maxDenomIdxArray_])

console.log(
  clc.magenta(`cryDef=${cryDef} minBet_="MaxRangeDenom" `) + clc.red(maxRangeMinBetDenomList) + "," + maxDenomIdxArray_
)

writeSinglePageExcel("./minBet.xlsx", "minBetSheet", excelMinBetOutput_)

const sql_ = `
SET @targetCid = "換上指定Hall的CidS";
SET @currency = "換上指定幣別代號";


SET @p1 = "${denomIdxByMinBetListMap_.get(1)}";
SET @dp1 = "${defaultDenomIdxByMinBetListMap_.get(1)}";
SET @p3 = "${denomIdxByMinBetListMap_.get(3)}";
SET @dp3 = "${defaultDenomIdxByMinBetListMap_.get(3)}";
SET @p5 = "${denomIdxByMinBetListMap_.get(5)}";
SET @dp5 = "${defaultDenomIdxByMinBetListMap_.get(5)}";
SET @p9 = "${denomIdxByMinBetListMap_.get(9)}";
SET @dp9 = "${defaultDenomIdxByMinBetListMap_.get(9)}";
SET @p10 = "${denomIdxByMinBetListMap_.get(10)}";
SET @dp10 = "${defaultDenomIdxByMinBetListMap_.get(10)}";
SET @p15 = "${denomIdxByMinBetListMap_.get(15)}";
SET @dp15 = "${defaultDenomIdxByMinBetListMap_.get(15)}";
SET @p20 = "${denomIdxByMinBetListMap_.get(20)}";
SET @dp20 = "${defaultDenomIdxByMinBetListMap_.get(20)}";
SET @p25 = "${denomIdxByMinBetListMap_.get(25)}";
SET @dp25 = "${defaultDenomIdxByMinBetListMap_.get(25)}";
SET @p30 = "${denomIdxByMinBetListMap_.get(30)}";
SET @dp30 = "${defaultDenomIdxByMinBetListMap_.get(30)}";
SET @p40 = "${denomIdxByMinBetListMap_.get(40)}";
SET @dp40 = "${defaultDenomIdxByMinBetListMap_.get(40)}";
SET @p50 = "${denomIdxByMinBetListMap_.get(50)}";
SET @dp50 = "${defaultDenomIdxByMinBetListMap_.get(50)}";
SET @p88 = "${denomIdxByMinBetListMap_.get(88)}";
SET @dp88 = "${defaultDenomIdxByMinBetListMap_.get(88)}";

INSERT INTO game.game_denom_setting
SELECT cId, gameId, currency, pb, dp ,null,0 FROM
(
SELECT gs.cId, gs.gameId, @currency as currency,
CASE 
WHEN g.minbet = 1 THEN @p1 
WHEN g.minbet = 3 THEN @p3 
WHEN g.minbet = 5 THEN @p5 
WHEN g.minbet = 9 THEN @p9 
WHEN g.minbet = 10 THEN @p10 
WHEN g.minbet = 15 THEN @p15
WHEN g.minbet = 20 THEN @p20
WHEN g.minbet = 25 THEN @p25 
WHEN g.minbet = 30 THEN @p30 
WHEN g.minbet = 40 THEN @p40 
WHEN g.minbet = 50 THEN @p50 
WHEN g.minbet = 88 THEN @p88 
ELSE @p1 END as pb,

CASE
WHEN g.minbet = 1 THEN @dp1 
WHEN g.minbet = 3 THEN @dp3 
WHEN g.minbet = 5 THEN @dp5 
WHEN g.minbet = 9 THEN @dp9 
WHEN g.minbet = 10 THEN @dp10
WHEN g.minbet = 15 THEN @dp15
WHEN g.minbet = 20 THEN @dp20
WHEN g.minbet = 25 THEN @dp25 
WHEN g.minbet = 30 THEN @dp30 
WHEN g.minbet = 40 THEN @dp40 
WHEN g.minbet = 50 THEN @dp50 
WHEN g.minbet = 88 THEN @dp88  
ELSE @dp1 END as dp,

null, 
0
FROM game.game_setting gs
JOIN game.games g 
ON g.gameId = gs.gameId
WHERE cid = @targetCid
) t;`

writeAlter("./", sql_)

console.log(sql_)

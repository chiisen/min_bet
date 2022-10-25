import { writeAlter } from "./helpers"

export function processSQL(denomIdxByMinBetListMap_, defaultDenomIdxByMinBetListMap_) {
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
) t
on duplicate key update Denom = t.pb, DefaultDenomId = t.dp;`

  writeAlter("./output/", sql_)

  console.log(sql_)
}

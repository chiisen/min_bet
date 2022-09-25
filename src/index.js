const { denom, betLevel, minBetList, cryDef } = require("./data")
const { swapMap } = require("./helpers")

minBetList.map((mb) => {
  const checkDenom = new Map()

  betLevel.map((lv) => {
    const denomList = Array.from(denom.values())

    //console.log("minBet * betLevel * denom / cryDef");

    let v = 0
    denomList.map((d) => {
      v = (mb * lv * d) / cryDef
      if (v > 0.6 && v < 200) {
        const cd = checkDenom.get(d)
        let mv = 1
        if (cd) {
          mv += cd
        }
        checkDenom.set(d, mv)

        //console.log(`☯️${mb} * ${lv} * ${d} / ${cryDef} = ` + v.toFixed(6));
      }
    })
    //console.log("================================================");
  })

  let res = swapMap(denom)

  console.log("================================================")
  checkDenom.forEach((k, v) => {
    if (k >= 10) {
      console.log(`cryDef=${cryDef} minBet=${mb} ` + res.get(v))
    }
  })
})

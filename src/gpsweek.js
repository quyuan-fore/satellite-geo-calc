const zero = 315936000
const gpsLeapMS = [
    46828800000, 78364801000, 109900802000, 173059203000, 252028804000, 315187205000, 346723206000,
    393984007000, 425520008000, 457056009000, 504489610000, 551750411000, 599184012000, 820108813000,
    914803214000, 1025136015000, 1119744016000, 1167264017000
]
const gpsLeapS = gpsLeapMS.map((value) => { return value / 1000 })

/*
    { wn:<Number>, tow:<Number> }
    wn, gps week
    tow, second in a gps week, 周内秒
    result
    time , a unix timestrap, 10bits, like 1588063179
*/
function w2uOrigin(param) {
    let wn = param.wn
    let tow = param.tow
    const gpst = Number(wn) * 7 * 24 * 60 * 60 + Number(tow)
    let n = 0
    gpsLeapS.forEach((value) => {
        if (gpst > value) {
            n++
        }
    })
    return zero + gpst - n
}
/*
    timestrap
    <String> or <Number> , time , a unix timestrap, 10bits, like 1588063179
    result
    { wn:<Number>, tow:<Number> }
    wn, gps week
    tow, second in a gps week, 周内秒
*/
function u2wOrigin(timestrap) {
    let diff = Number(timestrap) - zero
    for (let i = 0; i < gpsLeapS.length; i++) {
        if ((diff + 1) >= gpsLeapS[i]) {
            diff++
        }
    }
    const wn = Number((diff / 604800).toFixed(0))
    const tow = diff % 604800
    return {
        wn,
        tow
    }
}

// module.exports = {
//     u2w:u2wOrigin,
//     w2u:w2uOrigin
// }
export default {
    u2w:u2wOrigin,
    w2u:w2uOrigin
}
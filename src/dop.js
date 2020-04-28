const numeric = require('numeric')
/*
    params
    arr, array with satellite's az and el
    item { az:<Number>, el:<Number> }
    arr, [{az:xx, el:xx} , ...]
    when arr.length >=4, dop is valid

    result
    { pdop:<Number>, hdop:<Number>, gdop:<Number>, vdop:<Number> }
*/
function _calc(arr) {
    if (arr.length < 4) {
        return {
            gdop: '#',
            pdop: '#',
            vdop: '#',
            hdop: '#'
        }
    }
    const A = numeric.rep([arr.length, 4], 0)
    const azlist = []
    const ellist = []
    arr.forEach((value, i) => {
        azlist.push(value.az)
        ellist.push(value.el)
        const B = [Math.cos(value.el * Math.PI / 180.0) * Math.sin(value.az * Math.PI / 180.0), Math.cos(value.el * Math.PI / 180.0) * Math.cos(value.az * Math.PI / 180.0), Math.sin(value.el * Math.PI / 180.0), 1]
        numeric.setBlock(A, [i, 0], [i, 3], [B])
    })
    var Q = numeric.dot(numeric.transpose(A), A)
    var Qinv = numeric.inv(Q)
    const saveNumber = 2
    var pdop = Math.sqrt(Qinv[0][0] + Qinv[1][1] + Qinv[2][2]).toFixed(saveNumber)
    var hdop = Math.sqrt(Qinv[0][0] + Qinv[1][1]).toFixed(saveNumber)
    var gdop = Math.sqrt(Qinv[0][0] + Qinv[1][1] + Qinv[2][2] + Qinv[3][3]).toFixed(saveNumber)
    var vdop = Math.sqrt(Qinv[2][2]).toFixed(saveNumber)
    return {
        pdop,
        hdop,
        gdop,
        vdop
    }
}

module.exports = {
    calc_dop:_calc
}
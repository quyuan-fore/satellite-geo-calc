/*
    ll ecef
    {lon:<Number>,lat:<Number>}
    result
    {x:<Number>,y:<Number>}
*/
function ll_to_mercator(ll){
    var mercator = {}
    var earthRad = 6356752.3142
    mercator.x = Number(ll.lon) * Math.PI / 180 * earthRad
    var tem = Number(ll.lat) * Math.PI / 180
    mercator.y = earthRad / 2 * Math.log((1.0 + Math.sin(tem)) / (1.0 - Math.sin(tem)))
    return mercator
}
// module.exports = {
//     ll_to_mercator
// }
export default {
    ll_to_mercator
}
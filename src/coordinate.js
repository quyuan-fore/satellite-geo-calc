// 长半轴 Semimajor axis
let a = 6378137
// 短半轴 semiminor axis
let b = 6356752.3142
// 扁率 flattening
let f = (a-b)/a
// 偏心率
let e_sq = f * (2 - f)
// pi
let pi = Math.PI

function radians(val){
    return Number(val)/180*pi
}

// lla 大地坐标
// ecef 地心地固坐标系
/*
    params lla
    {lon:<Number>,lat:<Number>,alt:<Number>}
    result
    {x:<Number>,y:<Number>,z:<Number>}
*/
function lla_to_ecef(lla){
    let lon = Number(lla.lon)
    let lat = Number(lla.lat)
    let alt = Number(lla.alt)
    let lamb = radians(lat)
    let phi = radians(lon)
    let s = Math.sin(lamb)
    let N = a/Math.sqrt(1-e_sq*s*s)

    let sin_lambda = Math.sin(lamb)
    let cos_lambda = Math.cos(lamb)

    let sin_phi = Math.sin(phi)
    let cos_phi = Math.cos(phi)

    let x = (alt + N)*cos_lambda*cos_phi
    let y = (alt + N)*cos_lambda*sin_phi
    let z = (alt + (1-e_sq)*N)*sin_lambda

    return {x,y,z}
}

/*
    params ecef
    {x:<Number>,y:<Number>,z:<Number>}
    result
    {lon:<Number>,lat:<Number>,alt:<Number>}
*/
function ecef_to_lla(ecef){
    let {x,y,z} = ecef
    x = Number(x)
    y = Number(y)
    z = Number(y)
    let x2 = x*x
    let y2 = y*y
    let z2 = z*z

    let e = Math.sqrt(1-(b/a)**2)
    let b2 = b*b
    let e2 = e*e
    let ep = e*(a/b)
    let r = Math.sqrt(x2+y2)
    let r2 = r*r
    let E2 = a**2 - b**2
    let F = 54*b2*z2
    let G = r2 + (1-e2)*z2 - e2*E2
    let c = (e2*e2*F*r2)/(G*G*G)
    let s = ( 1 + c + Math.sqrt(c*c + 2*c) )**(1/3)
    let P = F / (3 * (s+1/s+1)**2 * G*G)
    let Q = Math.sqrt(1+2*e2*e2*P)
    let ro = -(P*e2*r)/(1+Q) + Math.sqrt((a*a/2)*(1+1/Q) - (P*(1-e2)*z2)/(Q*(1+Q)) - P*r2/2)
    let tmp = (r - e2*ro) ** 2
    let U = Math.sqrt( tmp + z2 )
    let V = Math.sqrt( tmp + (1-e2)*z2 )
    let zo = (b2*z)/(a*V)

    let height = U*( 1 - b2/(a*V) )

    let lat = Math.atan( (z + ep*ep*zo)/r )

    let temp = Math.atan(y/x)
    let long
    if(x>=0){
        long = temp
    }else if(x<0 && y>=0){
        long = pi + temp
    }else{
        long = temp - pi
    }

    let lat0 = lat/(pi/180)
    let lon0 = long/(pi/180)
    let alt0 = height

    return {
        lon:lon0,
        lat:lat0,
        alt:alt0
    }
}

/*
    params enu
    {x:<Number>,y:<Number>,z:<Number>}
    params lla_ref , lla for enu origin
    {lon:<Number>,lat:<Number>,alt:<Number>}
    result
    {x:<Number>,y:<Number>,z:<Number>}
*/
function enu_to_ecef(enu,lla_ref){
    let xEast = Number(enu.x)
    let yNorth = Number(enu.y)
    let zUp = Number(enu.z)

    let lat0 = Number(lla_ref.lat)
    let lon0 = Number(lla_ref.lon)
    let h0 = Number(lla_ref.alt)

    let lamb = radians(lat0)
    let phi = radians(lon0)
    let s = Math.sin(lamb)
    let N = a / Math.sqrt(1 - e_sq * s * s)

    let sin_lambda = Math.sin(lamb)
    let cos_lambda = Math.cos(lamb)
    let sin_phi = Math.sin(phi)
    let cos_phi = Math.cos(phi)

    let x0 = (h0 + N) * cos_lambda * cos_phi
    let y0 = (h0 + N) * cos_lambda * sin_phi
    let z0 = (h0 + (1 - e_sq) * N) * sin_lambda

    let t = cos_lambda * zUp - sin_lambda * yNorth

    let zd = sin_lambda * zUp + cos_lambda * yNorth
    let xd = cos_phi * t - sin_phi * xEast 
    let yd = sin_phi * t + cos_phi * xEast

    let x = xd + x0 
    let y = yd + y0 
    let z = zd + z0 

    return {x,y,z}
}

/*
    params enu
    {x:<Number>,y:<Number>,z:<Number>}
    params lla_ref , lla for enu origin
    {lon:<Number>,lat:<Number>,alt:<Number>}
    result
    {lon:<Number>,lat:<Number>,alt:<Number>}
*/
function enu_to_lla(enu,lla_ref){
    let tem = lla_to_ecef(enu,lla_ref)
    return ecef_to_lla(tem)
}

/*
    params ecef
    {x:<Number>,y:<Number>,z:<Number>}
    params lla_ref , lla for enu origin
    {lon:<Number>,lat:<Number>,alt:<Number>}
    result
    {x:<Number>,y:<Number>,z:<Number>}
*/
function ecef_to_enu(ecef,lla_ref){
    let x = Number(ecef.x)
    let y = Number(ecef.y)
    let z = Number(ecef.z)
    let lat0 = Number(lla_ref.lat)
    let lon0 = Number(lla_ref.lon)
    let h0 = Number(lla_ref.alt)

    let lamb = radians(lat0)
    let phi = radians(lon0)
    let s = Math.sin(lamb)
    let N = a / Math.sqrt(1 - e_sq * s * s)

    let sin_lambda = Math.sin(lamb)
    let cos_lambda = Math.cos(lamb)
    let sin_phi = Math.sin(phi)
    let cos_phi = Math.cos(phi)

    let x0 = (h0 + N) * cos_lambda * cos_phi
    let y0 = (h0 + N) * cos_lambda * sin_phi
    let z0 = (h0 + (1 - e_sq) * N) * sin_lambda

    let xd = x - x0
    let yd = y - y0
    let zd = z - z0

    let t = -cos_phi * xd -  sin_phi * yd

    let xEast = -sin_phi * xd + cos_phi * yd
    let yNorth = t * sin_lambda  + cos_lambda * zd
    let zUp = cos_lambda * cos_phi * xd + cos_lambda * sin_phi * yd + sin_lambda * zd

    return {
        x:xEast,
        y:yNorth,
        z:zUp
    }
}

/*
    lla ecef
    {lon:<Number>,lat:<Number>,alt:<Number>}
    params lla_ref , lla for enu origin
    {lon:<Number>,lat:<Number>,alt:<Number>}
    result
    {x:<Number>,y:<Number>,z:<Number>}
*/
function lla_to_enu(lla,lla_ref){
    let ecef = lla_to_ecef(lla)
    return ecef_to_enu(ecef,lla_ref)
}

module.exports = {
    lla_to_ecef,
    ecef_to_lla,
    enu_to_ecef,
    enu_to_lla,
    ecef_to_enu,
    lla_to_enu
}
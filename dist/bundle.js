(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global['satellite-geo-calc'] = factory());
}(this, (function () { 'use strict';

    // 长半轴 Semimajor axis
    let a = 6378137;
    // 短半轴 semiminor axis
    let b = 6356752.3142;
    // 扁率 flattening
    let f = (a-b)/a;
    // 偏心率
    let e_sq = f * (2 - f);
    // pi
    let pi = Math.PI;

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
        let lon = Number(lla.lon);
        let lat = Number(lla.lat);
        let alt = Number(lla.alt);
        let lamb = radians(lat);
        let phi = radians(lon);
        let s = Math.sin(lamb);
        let N = a/Math.sqrt(1-e_sq*s*s);

        let sin_lambda = Math.sin(lamb);
        let cos_lambda = Math.cos(lamb);

        let sin_phi = Math.sin(phi);
        let cos_phi = Math.cos(phi);

        let x = (alt + N)*cos_lambda*cos_phi;
        let y = (alt + N)*cos_lambda*sin_phi;
        let z = (alt + (1-e_sq)*N)*sin_lambda;

        return {x,y,z}
    }

    /*
        params ecef
        {x:<Number>,y:<Number>,z:<Number>}
        result
        {lon:<Number>,lat:<Number>,alt:<Number>}
    */
    function ecef_to_lla(ecef){
        let {x,y,z} = ecef;
        x = Number(x);
        y = Number(y);
        z = Number(y);
        let x2 = x*x;
        let y2 = y*y;
        let z2 = z*z;

        let e = Math.sqrt(1-(b/a)**2);
        let b2 = b*b;
        let e2 = e*e;
        let ep = e*(a/b);
        let r = Math.sqrt(x2+y2);
        let r2 = r*r;
        let E2 = a**2 - b**2;
        let F = 54*b2*z2;
        let G = r2 + (1-e2)*z2 - e2*E2;
        let c = (e2*e2*F*r2)/(G*G*G);
        let s = ( 1 + c + Math.sqrt(c*c + 2*c) )**(1/3);
        let P = F / (3 * (s+1/s+1)**2 * G*G);
        let Q = Math.sqrt(1+2*e2*e2*P);
        let ro = -(P*e2*r)/(1+Q) + Math.sqrt((a*a/2)*(1+1/Q) - (P*(1-e2)*z2)/(Q*(1+Q)) - P*r2/2);
        let tmp = (r - e2*ro) ** 2;
        let U = Math.sqrt( tmp + z2 );
        let V = Math.sqrt( tmp + (1-e2)*z2 );
        let zo = (b2*z)/(a*V);

        let height = U*( 1 - b2/(a*V) );

        let lat = Math.atan( (z + ep*ep*zo)/r );

        let temp = Math.atan(y/x);
        let long;
        if(x>=0){
            long = temp;
        }else if(x<0 && y>=0){
            long = pi + temp;
        }else {
            long = temp - pi;
        }

        let lat0 = lat/(pi/180);
        let lon0 = long/(pi/180);
        let alt0 = height;

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
        let xEast = Number(enu.x);
        let yNorth = Number(enu.y);
        let zUp = Number(enu.z);

        let lat0 = Number(lla_ref.lat);
        let lon0 = Number(lla_ref.lon);
        let h0 = Number(lla_ref.alt);

        let lamb = radians(lat0);
        let phi = radians(lon0);
        let s = Math.sin(lamb);
        let N = a / Math.sqrt(1 - e_sq * s * s);

        let sin_lambda = Math.sin(lamb);
        let cos_lambda = Math.cos(lamb);
        let sin_phi = Math.sin(phi);
        let cos_phi = Math.cos(phi);

        let x0 = (h0 + N) * cos_lambda * cos_phi;
        let y0 = (h0 + N) * cos_lambda * sin_phi;
        let z0 = (h0 + (1 - e_sq) * N) * sin_lambda;

        let t = cos_lambda * zUp - sin_lambda * yNorth;

        let zd = sin_lambda * zUp + cos_lambda * yNorth;
        let xd = cos_phi * t - sin_phi * xEast; 
        let yd = sin_phi * t + cos_phi * xEast;

        let x = xd + x0; 
        let y = yd + y0; 
        let z = zd + z0; 

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
        let tem = lla_to_ecef(enu);
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
        let x = Number(ecef.x);
        let y = Number(ecef.y);
        let z = Number(ecef.z);
        let lat0 = Number(lla_ref.lat);
        let lon0 = Number(lla_ref.lon);
        let h0 = Number(lla_ref.alt);

        let lamb = radians(lat0);
        let phi = radians(lon0);
        let s = Math.sin(lamb);
        let N = a / Math.sqrt(1 - e_sq * s * s);

        let sin_lambda = Math.sin(lamb);
        let cos_lambda = Math.cos(lamb);
        let sin_phi = Math.sin(phi);
        let cos_phi = Math.cos(phi);

        let x0 = (h0 + N) * cos_lambda * cos_phi;
        let y0 = (h0 + N) * cos_lambda * sin_phi;
        let z0 = (h0 + (1 - e_sq) * N) * sin_lambda;

        let xd = x - x0;
        let yd = y - y0;
        let zd = z - z0;

        let t = -cos_phi * xd -  sin_phi * yd;

        let xEast = -sin_phi * xd + cos_phi * yd;
        let yNorth = t * sin_lambda  + cos_lambda * zd;
        let zUp = cos_lambda * cos_phi * xd + cos_lambda * sin_phi * yd + sin_lambda * zd;

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
        let ecef = lla_to_ecef(lla);
        return ecef_to_enu(ecef,lla_ref)
    }

    // module.exports = {
    //     lla_to_ecef,
    //     ecef_to_lla,
    //     enu_to_ecef,
    //     enu_to_lla,
    //     ecef_to_enu,
    //     lla_to_enu
    // }

    var coordinateTransfer = {
        lla_to_ecef,
        ecef_to_lla,
        enu_to_ecef,
        enu_to_lla,
        ecef_to_enu,
        lla_to_enu
    };

    /*
        ll ecef
        {lon:<Number>,lat:<Number>}
        result
        {x:<Number>,y:<Number>}
    */
    function ll_to_mercator(ll){
        var mercator = {};
        var earthRad = 6356752.3142;
        mercator.x = Number(ll.lon) * Math.PI / 180 * earthRad;
        var tem = Number(ll.lat) * Math.PI / 180;
        mercator.y = earthRad / 2 * Math.log((1.0 + Math.sin(tem)) / (1.0 - Math.sin(tem)));
        return mercator
    }
    // module.exports = {
    //     ll_to_mercator
    // }
    var mercator = {
        ll_to_mercator
    };

    const numeric = require('numeric');
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
        const A = numeric.rep([arr.length, 4], 0);
        const azlist = [];
        const ellist = [];
        arr.forEach((value, i) => {
            azlist.push(value.az);
            ellist.push(value.el);
            const B = [Math.cos(value.el * Math.PI / 180.0) * Math.sin(value.az * Math.PI / 180.0), Math.cos(value.el * Math.PI / 180.0) * Math.cos(value.az * Math.PI / 180.0), Math.sin(value.el * Math.PI / 180.0), 1];
            numeric.setBlock(A, [i, 0], [i, 3], [B]);
        });
        var Q = numeric.dot(numeric.transpose(A), A);
        var Qinv = numeric.inv(Q);
        const saveNumber = 2;
        var pdop = Math.sqrt(Qinv[0][0] + Qinv[1][1] + Qinv[2][2]).toFixed(saveNumber);
        var hdop = Math.sqrt(Qinv[0][0] + Qinv[1][1]).toFixed(saveNumber);
        var gdop = Math.sqrt(Qinv[0][0] + Qinv[1][1] + Qinv[2][2] + Qinv[3][3]).toFixed(saveNumber);
        var vdop = Math.sqrt(Qinv[2][2]).toFixed(saveNumber);
        return {
            pdop,
            hdop,
            gdop,
            vdop
        }
    }

    // module.exports = {
    //     calc_dop:_calc
    // }

    var dop = {
        calc_dop:_calc
    };

    const zero = 315936000;
    const gpsLeapMS = [
        46828800000, 78364801000, 109900802000, 173059203000, 252028804000, 315187205000, 346723206000,
        393984007000, 425520008000, 457056009000, 504489610000, 551750411000, 599184012000, 820108813000,
        914803214000, 1025136015000, 1119744016000, 1167264017000
    ];
    const gpsLeapS = gpsLeapMS.map((value) => { return value / 1000 });

    /*
        wn
        <String> or <Number> , gps week
        tow
        <String> or <Number> , second in a gps week ,周内秒
        result
        time , a unix timestrap, 10bits, like 1588063179
    */
    function w2uOrigin(wn, tow) {
        const gpst = Number(wn) * 7 * 24 * 60 * 60 + Number(tow);
        let n = 0;
        gpsLeapS.forEach((value) => {
            if (gpst > value) {
                n++;
            }
        });
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
        let diff = Number(timestrap) - zero;
        for (let i = 0; i < gpsLeapS.length; i++) {
            if ((diff + 1) >= gpsLeapS[i]) {
                diff++;
            }
        }
        const wn = Number((diff / 604800).toFixed(0));
        const tow = diff % 604800;
        return {
            wn,
            tow
        }
    }

    // module.exports = {
    //     u2w:u2wOrigin,
    //     w2u:w2uOrigin
    // }
    var gpsweek = {
        u2w:u2wOrigin,
        w2u:w2uOrigin
    };

    // let coordinateTransfer = require('./coordinate')
    // module.exports = {
    //     coordinateTransfer,
    //     mercator,
    //     dop,
    //     gpsweek
    // }
    var index = {
        coordinateTransfer,
        mercator,
        dop,
        gpsweek
    };

    return index;

})));

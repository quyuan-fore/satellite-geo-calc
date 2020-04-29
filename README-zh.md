# satellite-geo-calc


> 这是一个用于卫星定位相关计算的工具，主要提供空间坐标转换、dop计算、GPS时间转换、墨卡托投影坐标转换等功能；也可以作为相关功能的参考。

> 请从v0.0.7版本开始使用。

## Installation

```bash
npm install --save-dev satellite-geo-calc
```

## Usage

Browser
```bash
<script src="./node_modules/satellite-geo-calc/dist/bundle.js"></script>
```
CommonJs
```bash
let satellite_geo_calc = require('satellite-geo-calc')
```

ES module
```bash
import satellite_geo_calc from 'satellite-geo-calc'
```

## API

### 空间坐标转换
```bash
// coordinate transfer

1. lla to ecef
@param { lon:<Number>, lat:<Number>, alt:<Number> }
satellite_geo_calc.coordinateTransfer.lla_to_ecef(
{ lat: 39.916527, lon: 116.391389, alt: 46 }
)
// output {x: -2177472.7792127146, y: 4388146.268379714, z: 4070910.801458577}

2. ecef to lla
@param { x:<Number>, y:<Number>, z:<Number> }
satellite_geo_calc.coordinateTransfer.ecef_to_lla(
{x: -2177472.7792127146, y: 4388146.268379714, z: 4070910.801458577})
// oupput {lon: 116.391389, lat: 42.0385771807474, alt: 208113.31767852278}

3. enu to ecef
@param1 { x:<Number>, y:<Number>, z:<Number> }
@param2 { lon:<Number>, lat:<Number>, alt:<Number> } reference point lla
satellite_geo_calc.coordinateTransfer.enu_to_ecef(
    {x: 6144810.141746415, y: 1676013.2245262354, z: -5949873.651021555},
    { lat: 39.916527, lon: 116.391389, alt: 46 }
)
// output {x: -5175375.166225361, y: -3394416.3352002986, z: 1538518.83548673}

4. enu to lla
@param1 { x:<Number>, y:<Number>, z:<Number> }
@param2 { lon:<Number>, lat:<Number>, alt:<Number> } reference point lla
satellite_geo_calc.coordinateTransfer.enu_to_lla(
    {x: 6144810.141746415, y: 1676013.2245262354, z: -5949873.651021555},
    { lat: 39.916527, lon: 116.391389, alt: 46 }
)
// output {lon: -146.74, lat: 14.050000000000002, alt: 699.9999999998037}

5. ecef to enu
@param1 { x:<Number>, y:<Number>, z:<Number> }
@param2 { lon:<Number>, lat:<Number>, alt:<Number> } reference point lla
satellite_geo_calc.coordinateTransfer.ecef_to_enu(
    {x: -5175375.166225361, y: -3394416.335200299, z: 1538518.8354867299},
    { lat: 39.916527, lon: 116.391389, alt: 46 }
)
// output {x: 6144810.141746415, y: 1676013.2245262354, z: -5949873.651021555}

6. lla to enu
@param1 { lon:<Number>, lat:<Number>, alt:<Number> }
@param2 { lon:<Number>, lat:<Number>, alt:<Number> } reference point lla
satellite_geo_calc.coordinateTransfer.lla_to_enu(
    { lon:-146.74, lat:14.05,alt:700},
    { lat: 39.916527, lon: 116.391389, alt: 46 }
)
// output {x: 6144810.141746415, y: 1676013.2245262354, z: -5949873.651021555}

```

### 墨卡托坐标转换
```bash
// mercator transfer

1. mercator transfer
@param { lon:<Number>, lat:<Number>, alt:<Number> }
satellite_geo_calc.mercator.ll_to_mercator({lon:116,lat:47})
// output {x: 12869765.883520856, y: 5922151.4230682505}
```

### dop计算
```bash
// dop calculate

1. dop calculate
@param array , child is { az:<Number>, el:<Number>} az 方位角， el 仰角
satellite_geo_calc.dop.calc_dop([
{az:45,el:70},{az:65,el:80},{az:250,el:60},{az:300,el:88},{az:180,el:20}
])
// output {pdop: "10.02", hdop: "5.62", gdop: "12.58", vdop: "8.29"}

当数组长度小于4时，计算无效，输出为
// output {gdop: "#", pdop: "#", vdop: "#", hdop: "#"}
```

### gps时间计算
```bash
// gps time 

1. unix timestamp to gps time
@param <Number> 10位unix时间戳
satellite_geo_calc.gpsweek.u2w(1588139830)
// output {wn: 2104, tow: 309448}

2. gps time to unix timestamp
@param { wn:<Number>, tow:<Number> } gps周，周内秒
satellite_geo_calc.gpsweek.w2u({wn: 2104, tow: 309448})
// output 1588744630
```

## Reference
[ECEF-LLH-ENU](https://github.com/milkytipo/ECEF-LLH-ENU)

[geodetic-to-ecef](https://github.com/substack/geodetic-to-ecef)
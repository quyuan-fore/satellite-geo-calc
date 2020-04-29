import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

const path = require('path');
const resolvePath = function (filePath) {
    return path.join(__dirname, '.', filePath)
}
export default {
    input: resolvePath('src/index.js'), 
    output: { 
        file: resolvePath('dist/bundle.js'),
        format: 'umd',
        name:'satellite_geo_calc'
    },
    plugins:[
        nodeResolve({
            jsnext: true,
            main: true
        }),
        commonjs({
            include: 'node_modules/**',
            extensions: [ '.js', '.coffee' ],
            ignoreGlobal: false
        }),
        babel({
            exclude: 'node_modules/**',
            runtimeHelpers: true,
        })
    ],
    external: id => {
        return /@babel\/runtime/.test(id) || /lodash/.test(id);
    }
};
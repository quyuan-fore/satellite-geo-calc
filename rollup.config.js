// export default {
//     input: 'src/index.js',
//     output: {
//       file: 'bundle.js',
//       format: 'cjs'
//     }
//   };

  // rollup.config.js
const path = require('path');
const resolve = function (filePath) {
    return path.join(__dirname, '.', filePath)
}
export default {
    input: resolve('src/index.js'), // 入口文件
    output: { // 出口文件
        file: resolve('dist/bundle.js'),
        format: 'umd',
        name:'satellite-geo-calc'
    }
};
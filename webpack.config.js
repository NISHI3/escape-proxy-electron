const path = require('path');

// module.exports = {
//     mode: 'development', // "production" | "development" | "none"
//     target: 'electron-main',
//     entry: path.join(__dirname, 'src', 'index'),
//     cache: true,
//     devtool: 'source-map',
//     output: {
//         filename: 'index.js',
//         path: path.join(__dirname, 'dist')
//     },
//     module: {
//         rules: [{
//             test: /.ts?$/,
//             include: [
//                 path.resolve(__dirname, 'src'),
//             ],
//             exclude: [
//                 path.resolve(__dirname, 'node_modules'),
//             ],
//             loader: 'ts-loader',
//         }]
//     },
//     resolve: {
//         extensions: [ '.ts', '.js' ]
//     },
// };


const mainConfig = {
    target: 'electron-main',
    entry: './src/main.js',
    output: {
      path: path.join(__dirname, './src/dist'),
      filename: 'main.js'
    },
    // __dirnameを使えるように
    node: {__dirname: false}
    // module: {
    //   rules: [
    //     {
    //       test: /\.js$/,
    //       exclude: /node_modules/,
    //       loader: 'babel-loader'
    //     }
    //   ]
    // }
  }
  
  const rendererConfig = {
    target: 'electron-renderer',
    entry: './src/renderer.js',
    output: {
      path: path.join(__dirname, 'src/dist'),
      filename: 'renderer.js'
    },
    node: {__dirname: false},
    module: {
      rules: []
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        inject: 'body'
  }),
    ]
  }
  
  module.exports = [ mainConfig, rendererConfig]
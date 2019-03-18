const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const mainConfig = {
  mode: 'development',
  target: 'electron-main',
  entry: './src/main.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js'
  },
  // __dirnameを使えるように
  node: {__dirname: false},
  devtool: 'source-map',
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
  mode: 'development',
  target: 'electron-renderer',
  entry: './src/renderer.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'renderer.js'
  },
  node: {__dirname: false},
  devtool: 'source-map',
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
    new CopyWebpackPlugin([
      { 
        from: 'src/package.json'
      },
      {
        from: 'src/images/',
        to: 'images/'
      }
    ])
  ]
}
  
module.exports = [ mainConfig, rendererConfig]
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const mainConfig = {
  mode: 'development',
  target: 'electron-main',
  entry: './src/main.ts',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js'
  },
  // __dirnameを使えるように
  node: {
    __dirname: false
  },
  devtool: 'source-map',
  module: {
    rules: [{
      test: /.ts?$/,
      include: [
        path.resolve(__dirname, 'src'),
      ],
      exclude: [
        path.resolve(__dirname, 'node_modules'),
      ],
      loader: 'ts-loader',
    }]
  },
  resolve: {
    extensions: ['.js', '.ts']
  }
}
  
const rendererConfig = {
  mode: 'development',
  target: 'electron-renderer',
  entry: './src/renderer.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'renderer.js'
  },
  node: {
    __dirname: false
  },
  devtool: 'source-map',
  module: {
    rules: [{
      test: /.ts?$/,
      use: [
        'ts-loader'
      ],
      include: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'node_modules'),
      ],
    }]
  },
  resolve: {
    extensions: ['.json', '.js', '.css', '.ts', '.vue'],
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
        from: path.resolve(__dirname, 'src/package.json')
      },
      {
        from: path.resolve(__dirname, 'src/images/'),
        to: path.resolve(__dirname, './dist/images/')
      }
    ])
  ]
}
  
module.exports = [ mainConfig, rendererConfig]
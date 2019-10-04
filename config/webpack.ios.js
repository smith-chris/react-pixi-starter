const merge = require('webpack-merge')
const common = require('./webpack.common.js')

const path = require('path')

const isDev = process.argv.indexOf('-p') === -1

module.exports = merge(common({ isIOS: true }), {
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'cheap-module-source-map' : false,
  output: {
    path: path.resolve('./ejecta/App'),
  },
})

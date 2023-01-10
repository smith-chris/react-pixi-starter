const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common(), {
  entry: {
    index: ['./src/game.ts'],
  },
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    quiet: true,
    // hot: true,
  },
})

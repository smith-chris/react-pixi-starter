const merge = require('webpack-merge')
const common = require('./webpack.common.js')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = merge(common(), {
  entry: {
    index: ['./src/game.ts'],
  },
  mode: 'production',
  devtool: 'nosources-source-map',
  plugins: [new CleanWebpackPlugin()],
})

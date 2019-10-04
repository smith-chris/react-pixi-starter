const merge = require('webpack-merge')
const common = require('./webpack.common.js')

// const { HotModuleReplacementPlugin } = require('webpack')

module.exports = merge(common(), {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    quiet: true,
    hot: true,
  },
  // plugins: [new HotModuleReplacementPlugin()],
})

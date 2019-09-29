const path = require('path')
const { resolve } = require('./webpack.common.js')

const SRC_DIR = path.resolve('src')
const CONFIG_DIR = path.resolve('config')

module.exports = {
  rootDir: SRC_DIR,
  moduleDirectories: resolve.modules,
  // Webpack's extensions start with `.` but jest's do not
  moduleFileExtensions: resolve.extensions.map(v => v.slice(1)),
  transform: {
    '^.+\\.(j|t)sx?$': 'ts-jest',
  },
  testRegex: `(/.*(\\.|/)(test|spec))\\.(j|t)sx?$`,
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `${CONFIG_DIR}/mock.js`,
    '\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
}

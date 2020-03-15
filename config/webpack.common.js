const path = require('path')

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { wrap } = new (require('speed-measure-webpack-plugin'))()
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const { CheckerPlugin } = require('awesome-typescript-loader')

const isDev = process.argv.indexOf('-p') === -1

const ASSETS_PATH = path.resolve('./src/assets')

module.exports = () =>
  wrap({
    entry: {
      index: ['./src/setup/index.ts'],
    },
    output: {
      path: path.resolve('dist'),
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.ts', '.js', '.json', isDev ? '.dev.js' : '.prod.js'],
      modules: ['node_modules', path.resolve('./src')],
    },
    devtool: 'source-map',
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve('./src/index.html'),
        inject: 'body',
        appName: 'Typescript starter',
      }),
      new CopyPlugin([{ from: path.resolve('./src/assets'), to: 'assets' }]),
      new CheckerPlugin(),
      new FriendlyErrorsWebpackPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              // disable type checker - we will use it in fork plugin
              transpileOnly: true,
            },
          },
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          include: ASSETS_PATH,
          use: [
            {
              loader: 'sizeof-loader',
              options: Object.assign(
                {
                  limit: 16 * 1024,
                },
                isDev
                  ? {
                      // use full path in development for better readability
                      name: '[path][name].[ext]',
                    }
                  : {
                      outputPath: 'assets/',
                    },
              ),
            },
          ],
        },
        {
          test: /\.(eot|ttf|woff|woff2|svg)$/,
          include: ASSETS_PATH,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 32 * 1024,
                outputPath: 'assets/',
              },
            },
          ],
        },
        {
          test: /\.(fnt|xml|blk|bst|asm|tilecoll)$/,
          include: ASSETS_PATH,
          use: [
            {
              loader: 'raw-loader',
              options: {},
            },
          ],
        },
        {
          test: /\.(png|jpg|gif)$/i,
          include: path.resolve('./src/excalibur'),
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          include: path.resolve('./src/excalibur'),
          use: ['to-string-loader', 'css-loader'],
        },
        {
          test: /\.global\.css$/,
          include: path.resolve('./src'),
          exclude: path.resolve('./src/excalibur'),
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /^(?!.*(\.global)).*\.css$/,
          include: [path.resolve('./src'), path.resolve('./node_modules')],
          exclude: path.resolve('./src/excalibur'),
          use: [
            'style-loader',
            {
              loader: 'typings-for-css-modules-loader',
              options: {
                localIdentName: isDev
                  ? '[name]_[local]_[hash:base64:3]'
                  : '[hash:base64:10]',
                modules: true,
                namedExport: true,
                importLoaders: 1,
              },
            },
          ],
        },
      ],
    },
  })

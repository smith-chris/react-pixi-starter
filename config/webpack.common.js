const path = require('path')

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const isDev = process.argv.indexOf('-p') === -1

const ASSETS_PATH = path.resolve('./src/assets')

console.log(ASSETS_PATH)
module.exports = {
  entry: {
    vendor: [
      // Required to support async/await
      '@babel/polyfill',
    ],
    main: ['./src/index'],
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    // publicPath: '',
  },
  devtool: false,
  resolve: {
    extensions: [
      '.ts',
      '.tsx',
      '.js',
      '.jsx',
      '.json',
      isDev ? '.dev.tsx' : '.prod.tsx',
      isDev ? '.dev.js' : '.prod.js',
    ],
    modules: ['node_modules', path.resolve('./src')],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('./src/index.html'),
      inject: 'body',
      appName: 'React PIXI Starter',
    }),
    new ForkTsCheckerWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        include: path.resolve('./src'),
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            babelrc: false,
            presets: [
              [
                '@babel/preset-env',
                { targets: { browsers: 'last 2 versions' } }, // or whatever your project requires
              ],
              '@babel/preset-typescript',
              '@babel/preset-react',
            ],
            plugins: [
              // plugin-proposal-decorators is only needed if you're using experimental decorators in TypeScript
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              'react-hot-loader/babel',
            ],
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
        test: /\.global\.css$/,
        include: path.resolve('./src'),
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /^(?!.*(\.global)).*\.css$/,
        include: [path.resolve('./src'), path.resolve('./node_modules')],
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
}

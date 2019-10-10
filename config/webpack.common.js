const path = require('path')

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const isDev = process.argv.indexOf('-p') === -1

const ASSETS_PATH = path.resolve('./src/assets')

const paths = require('./paths')

const prefixExtensions = (extensions, prefix) => [
  ...extensions.map(v => prefix + v),
  ...extensions,
]

module.exports = ({ isIOS } = {}) => ({
  entry: {
    vendor: [
      // Required to support async/await
      '@babel/polyfill',
    ],
    index: ['./src/index'],
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    // publicPath: '',
  },
  devtool: false,
  resolve: {
    extensions: prefixExtensions(
      ['.ts', '.tsx', '.js', '.json'],
      isIOS ? '.ios' : '.web',
    ),
    modules: ['node_modules', path.resolve('./src')],
    // alias: {
    //   'react-dom': '@hot-loader/react-dom',
    // },
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
      // {
      //   test: /\.(js|mjs|jsx|ts|tsx)$/,
      //   include: paths.appSrc,
      //   loader: require.resolve('babel-loader'),
      //   options: {
      //     customize: require.resolve(
      //       'babel-preset-react-app/webpack-overrides',
      //     ),

      //     plugins: [
      //       '@babel/plugin-transform-react-jsx',
      //       '@babel/plugin-proposal-class-properties',
      //       [
      //         require.resolve('babel-plugin-named-asset-import'),
      //         {
      //           loaderMap: {
      //             svg: {
      //               ReactComponent:
      //                 '@svgr/webpack?-svgo,+titleProp,+ref![path]',
      //             },
      //           },
      //         },
      //       ],
      //     ],
      //     // This is a feature of `babel-loader` for webpack (not Babel itself).
      //     // It enables caching results in ./node_modules/.cache/babel-loader/
      //     // directory for faster rebuilds.
      //     cacheDirectory: true,
      //     // See #6846 for context on why cacheCompression is disabled
      //     cacheCompression: false,
      //     compact: !isDev,
      //   },
      // },
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
})

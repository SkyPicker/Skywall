import ExtractTextPlugin from 'extract-text-webpack-plugin'
import autoprefixer from 'autoprefixer'
import path from 'path'
import webpack from 'webpack'
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin'
import constants from './constants'
import webpackIsomorphicAssets from './assets'

const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(webpackIsomorphicAssets)

const hotHost = process.env.WEBPACK_HOST
const hotPort = process.env.WEBPACK_PORT
const devtools = 'cheap-module-eval-source-map'
const loaders = {
  css: '',
  less: '!less-loader',
  scss: '!sass-loader',
  sass: '!sass-loader?indentedSyntax',
  styl: '!stylus-loader',
}

export default function makeConfig(isDevelopment) {

  function stylesLoaders() {
    return Object.keys(loaders).map((ext) => {
      const modules = (ext !== 'css' ? '?modules' : '')
      const prefix = `css-loader${modules}!postcss-loader`
      const extLoaders = prefix + loaders[ext]
      const loader = isDevelopment
        ? `style-loader!${extLoaders}`
        : ExtractTextPlugin.extract('style-loader', extLoaders)
      return {
        loader,
        test: new RegExp(`\\.(${ext})$`),
      }
    })
  }

  const config = {
    hotHost,
    hotPort,
    cache: isDevelopment,
    debug: isDevelopment,
    devtool: isDevelopment ? devtools : '',
    entry: {
      app: isDevelopment ? [
        `webpack-hot-middleware/client?path=http://${hotHost}:${hotPort}/__webpack_hmr`,
        path.join(constants.SRC_DIR, 'skywall/frontend/index.js'),
      ] : [
        path.join(constants.SRC_DIR, 'skywall/frontend/index.js'),
      ],
    },

    module: {
      noParse: [/braintree-web/],
      loaders: [{
        test: /\.(gif|jpg|png|svg)$/,
        loader: 'url-loader?limit=10000',
      }, {
        test: /favicon\.ico$/,
        loader: 'url-loader?limit=1',
      }, {
        test: /\.(ttf|eot|svg|woff(2)?)(\?.*$|$)/,
        loader: 'url-loader?limit=100000',
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
      }, {
        test: /\.json$/,
        loader: 'json-loader',
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          cacheDirectory: false,
          presets: ['es2015', 'react', 'stage-0'].concat(isDevelopment ? ['react-hmre'] : []),
        },
      }].concat(stylesLoaders()),
    },
    output: isDevelopment ? {
      path: constants.BUILD_DIR,
      filename: '[name].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: `http://${hotHost}:${hotPort}/build/`,
    } : {
      path: constants.BUILD_DIR,
      //filename: '[name]-[hash].js',
      filename: '[name].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: '/assets/',
    },
    plugins: (() => {
      const plugins = []
      if (isDevelopment) {
        plugins.push(
          new webpack.optimize.OccurenceOrderPlugin(),
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NoErrorsPlugin(),
          webpackIsomorphicToolsPlugin.development(),
        )
      } else {
        plugins.push(
          new webpack.DefinePlugin({
            'process.env': {
              NODE_ENV: '"production"',
            },
          }),
          // Render styles into separate cacheable file to prevent FOUC and
          // optimize for critical rendering path.
          new ExtractTextPlugin('app.css', {
            allChunks: true,
          }),
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.OccurenceOrderPlugin(),
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              screw_ie8: true, // eslint-disable-line camelcase
              warnings: false, // Because uglify reports irrelevant warnings.
            },
          }),
          webpackIsomorphicToolsPlugin,
        )
      }
      return plugins
    })(),
    postcss: () => [autoprefixer({browsers: 'last 2 version'})],
    resolve: {
      extensions: ['', '.js'],
      root: constants.ABSOLUTE_BASE,
      alias: {
        react$: require.resolve(path.join(constants.NODE_MODULES_DIR, 'react')),
      },
    },
  }
  return config
}

import webpack from 'webpack'
import webpackDev from 'webpack-dev-middleware'
import webpackHot from 'webpack-hot-middleware'
import express from 'express'
import makeWebpackConfig from '../makeConfig'


export function runWebpackDevServer() {
  const webpackConfig = makeWebpackConfig(true)
  const compiler = webpack(webpackConfig)
  const app = express()

  app.use(webpackDev(compiler, {
    headers: {'Access-Control-Allow-Origin': '*'},
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
  }))

  app.use(webpackHot(compiler))

  const host = webpackConfig.hotHost
  const port = webpackConfig.hotPort
  app.listen(port, host, () => {
    console.log(`Hot server is now running on http://${host}:${port}`)
  })
}

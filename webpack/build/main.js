import rimraf from 'rimraf'
import webpack from 'webpack'
import makeWebpackConfig from '../makeConfig'


export function webpackBuild() {
  const webpackConfig = makeWebpackConfig(false)
  rimraf('./build', (error) => {
    if (error) {
      throw new Error(`Build error: {error}`)
    }
    webpack(webpackConfig, (error, stats) => {
      error = error || stats.errors && stats.errors[0] || stats.warnings && stats.warnings[0]
      if (error) {
        throw new Error(`Build error: {error}`)
      }
    })
  })
}

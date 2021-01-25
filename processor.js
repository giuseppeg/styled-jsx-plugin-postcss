const postcss = require('postcss')
const loader = require('postcss-load-config')

const loaderPromises = {}

module.exports = function processor(src, options) {
  options = options || {}

  const loaderPromise = loaderPromises.hasOwnProperty(options.path || 'auto')
    ? loaderPromises[options.path || 'auto']
    : loader(options.env || process.env, options.path, {
        argv: false
      }).then((pluginsInfo) => pluginsInfo.plugins || [])

  loaderPromises[options.path || 'auto'] = loaderPromise

  return loaderPromise
    .then((plugins) => postcss(plugins).process(src, { from: false }))
    .then((result) => result.css)
}

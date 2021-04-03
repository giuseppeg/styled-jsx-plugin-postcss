const postcss = require('postcss')
const loader = require('postcss-load-config')

const loaderPromises = {}

const safeFilenameFromOptions = options =>
  (options.babel || {}).filename || "unknown filename"

module.exports = function processor(src, options) {
  options = options || {}

  const loaderPromise = loaderPromises.hasOwnProperty(options.path || 'auto')
    ? loaderPromises[options.path || 'auto']
    : loader(options.env || process.env, options.path, {
        argv: false
      }).then((pluginsInfo) => pluginsInfo.plugins || [])

  loaderPromises[options.path || 'auto'] = loaderPromise

  return loaderPromise
    .then((plugins) => postcss(plugins).process(src, { from: safeFilenameFromOptions(options), map: false }))
    .then((result) => result.css)
}

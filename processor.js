const postcss = require('postcss')
const loader = require('postcss-load-plugins')

let plugins
let _processor

function processor(src, options) {
  options = options || {}
  let loaderPromise
  if (!plugins) {
    loaderPromise = loader(options.env || process.env, options.path, { argv: false })
      .then(pluginsInfo => {
        plugins = pluginsInfo.plugins || []
      })
  } else {
    loaderPromise = Promise.resolve()
  }

  return loaderPromise
    .then(() => {
      if (!_processor) {
        _processor = postcss(plugins)
      }
      return _processor.process(src, { from: false })
    })
    .then(result => result.css)
}

function jsonParse(str) {
  try {
      return JSON.parse(str);
  } catch (e) {
      return str;
  }
}

const args = process.argv.slice(2)
const src = args[0]
const options = jsonParse(args[1])
processor(src, options).then(function(result){
  console.log(result)
})

// module.exports = processor

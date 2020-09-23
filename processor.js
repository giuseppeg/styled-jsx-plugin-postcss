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

let input = "";
process.stdin.on("data", (data) => {
  input += data.toString();
});

process.stdin.on("end", () => {
  const inputData = JSON.parse(input)
  processor(inputData.css, inputData.settings).then(function(result){
    process.stdout.write(result)
  })
  .catch((err) => {
    // NOTE: we console.erorr(err) and then process.exit(1) instead of throwing the error
    // to avoid the UnhandledPromiseRejectionWarning message.
    console.error(err)
    process.exit(1)
  })
})

// module.exports = processor

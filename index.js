const loopWhile = require('deasync').loopWhile
const processor = require('./processor')

module.exports = (css, settings) => {
  let processedCss
  let wait = true

  function resolved(result) {
    processedCss = result
    wait = false
  }

  processor(css)
    .then(resolved)
    .catch(resolved)
  loopWhile(() => wait)

  if (processedCss instanceof Error || processedCss.name === 'CssSyntaxError') {
    throw processedCss
  }

  return processedCss
}

const loopWhile = require('deasync').loopWhile
const processor = require('./processor')

module.exports = (css, settings) => {
  const cssWithPlaceholders = css.replace(/%%(styled-jsx-placeholder-\d+)%%/g, '_$1_')
  let processedCss
  let wait = true

  function resolved(result) {
    processedCss = result
    wait = false
  }

  processor(cssWithPlaceholders)
    .then(resolved)
    .catch(resolved)
  loopWhile(() => wait)

  if (processedCss instanceof Error || processedCss.name === 'CssSyntaxError') {
    throw processedCss
  }

  return processedCss.replace(/_(styled-jsx-placeholder-\d+)_/g, '%%$1%%')
}

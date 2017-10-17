const loopWhile = require('deasync').loopWhile
const processor = require('./processor')

module.exports = (css, settings) => {
  const cssWithPlaceholders = css
    .replace(/%%styled-jsx-(expression|placeholder)-(\d+)%%/g, (_, p, id) =>
      `/*%%styled-jsx-${p}-${id}%%*/`
    )
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

  return processedCss
    .replace(/\/\*%%styled-jsx-(expression|placeholder)-(\d+)%%\*\//g, (_, p, id) =>
      `%%styled-jsx-${p}-${id}%%`
    )
}


const childProcess = require('child_process');
module.exports = (css, settings) => {
  const cssWithPlaceholders = css
    .replace(/%%styled-jsx-placeholder-(\d+)%%/g, (_, id) =>
      `/*%%styled-jsx-placeholder-${id}%%*/`
    )
  let cssWithPlaceholdersArg = cssWithPlaceholders
  let settingsArg = settings
  if(cssWithPlaceholdersArg)
    cssWithPlaceholdersArg = cssWithPlaceholders.replace(/\"/g,`\\"`)
  if(settingsArg)
    settingsArg = JSON.stringify(settings).replace(/\"/g,`\\"`)
  const result = childProcess.execSync(`node ${__dirname}/processor.js "${cssWithPlaceholdersArg}" "${settingsArg}"`,
            { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 })
  processedCss = result.toString().trim()

  if (processedCss instanceof Error || processedCss.name === 'CssSyntaxError') {
    throw processedCss
  }

  return processedCss
    .replace(/\/\*%%styled-jsx-placeholder-(\d+)%%\*\//g, (_, id) =>
      `%%styled-jsx-placeholder-${id}%%`
    )
}

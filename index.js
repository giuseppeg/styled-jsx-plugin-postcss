
const { execSync } = require('child_process');
const path = require('path');
module.exports = (css, settings) => {
  const cssWithPlaceholders = css
    .replace(/%%styled-jsx-placeholder-(\d+)%%/g, (_, id) =>
      `/*%%styled-jsx-placeholder-${id}%%*/`
    )
  const result = execSync(`node ${path.resolve(__dirname, "processor.js")}`, {
    input: JSON.stringify({
      css: cssWithPlaceholders,
      settings
    }),
    encoding: "utf8"
  });

  processedCss = result.toString().trim()

  if (processedCss instanceof Error || processedCss.name === 'CssSyntaxError') {
    throw processedCss
  }

  return processedCss
    .replace(/\/\*%%styled-jsx-placeholder-(\d+)%%\*\//g, (_, id) =>
      `%%styled-jsx-placeholder-${id}%%`
    )
}

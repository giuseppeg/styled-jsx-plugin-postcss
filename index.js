
const { spawnSync } = require('child_process');
const path = require('path');

module.exports = (css, settings) => {
  const cssWithPlaceholders = css
    .replace(/%%styled-jsx-placeholder-(\d+)%%/g, (_, id) =>
      `/*%%styled-jsx-placeholder-${id}%%*/`
    )
  const result = spawnSync("node",[path.resolve(__dirname, "processor.js")],{
    input: JSON.stringify({
      css: cssWithPlaceholders,
      settings
    }),
    encoding: "utf8"
  });

  processedCss = result.stdout

  if (result.stderr) {
    throw new Error(`postcss failed with ${result.stderr}`)
  }

  if (processedCss instanceof Error || processedCss.name === 'CssSyntaxError' ) {
    throw processedCss
  }

  return processedCss
    .replace(/\/\*%%styled-jsx-placeholder-(\d+)%%\*\//g, (_, id) =>
      `%%styled-jsx-placeholder-${id}%%`
    )
}

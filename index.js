
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

  if (result.stderr) {
    throw new Error(`postcss failed with ${result.stderr}`)
  }

  return result.stdout
    .replace(/\/\*%%styled-jsx-placeholder-(\d+)%%\*\//g, (_, id) =>
      `%%styled-jsx-placeholder-${id}%%`
    )
}

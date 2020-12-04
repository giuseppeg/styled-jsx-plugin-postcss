const compile = require("./compile");

module.exports = (css, settings) => {
  const cssWithPlaceholders = css.replace(
    /%%styled-jsx-placeholder-(\d+)%%/g,
    (_, id) => `/*%%styled-jsx-placeholder-${id}%%*/`
  );

  const result = compile(cssWithPlaceholders, settings);

  if (!result) {
    throw new Error(
      `styled-jsx-plugin-postcss did not compile the following CSS:\n\n${css
        .split("\n")
        .join("\n\t")}\n`
    );
  }

  return result.replace(
    /\/\*%%styled-jsx-placeholder-(\d+)%%\*\//g,
    (_, id) => `%%styled-jsx-placeholder-${id}%%`
  );
};

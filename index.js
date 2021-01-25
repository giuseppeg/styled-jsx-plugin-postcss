const compile = require("./compile");
const error = require("./error");

module.exports = (css, settings) => {
  const cssWithPlaceholders = css.replace(
    /%%styled-jsx-placeholder-(\d+)%%/g,
    (_, id) => `/*%%styled-jsx-placeholder-${id}%%*/`
  );

  const result = compile(cssWithPlaceholders, settings);

  if (!result) {
    error(
      `did not compile the following CSS:\n\n${css.split("\n").join("\n\t")}\n`
    );
  }

  return result.replace(
    /\/\*%%styled-jsx-placeholder-(\d+)%%\*\//g,
    (_, id) => `%%styled-jsx-placeholder-${id}%%`
  );
};

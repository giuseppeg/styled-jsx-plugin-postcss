module.exports = function error(message) {
  throw new Error(`[styled-jsx-plugin-postcss] ${message}`);
};

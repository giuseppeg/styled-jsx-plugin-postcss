const path = require("path");

module.exports = {
  plugins: {
    [require.resolve("./plugin.js")]: {},
  },
};

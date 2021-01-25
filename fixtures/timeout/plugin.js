const postcss = require("postcss");

module.exports = (options = {}) => ({
  postcssPlugin: "postcss-break",
  async Rule(rule, { result, postcss }) {
    await new Promise((resolve) => setTimeout(resolve, 20000));
    return rule;
  },
});

module.exports.postcss = true;

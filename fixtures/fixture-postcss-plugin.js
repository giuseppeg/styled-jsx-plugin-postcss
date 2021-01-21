const postcss = require("postcss");

module.exports = (options = {}) => ({
  postcssPlugin: "postcss-csso",
  Rule(rule, { result, postcss }) {
    rule.selector = rule.selector
      .split(" ")
      .map((s) => `${s}.plugin`)
      .join(" ");
    return rule;
  },
});

module.exports.postcss = true;

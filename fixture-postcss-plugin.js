const postcss = require('postcss')

module.exports = (options = {}) => ({
  postcssPlugin: 'postcss-csso',
  Once(root, { result, postcss }) {
    console.warn('warn')
    console.error('error')
    return root
  }
});

module.exports.postcss = true;

const postcss = require('postcss')

module.exports = postcss.plugin('postcss-fixture', () => (root) => {
  console.warn('warn')
  console.error('error')
  return root
})

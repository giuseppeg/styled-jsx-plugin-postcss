const path = require('path')

module.exports = {
  plugins: {
    'postcss-easy-import': {},
    'postcss-preset-env': {
      browsers: ['last 2 versions', 'ie >= 10'],
      features: {
        'nesting-rules': true,
        'color-mod-function': {
          unresolved: 'warn',
        },
      },
    },
    'postcss-spiffing': {},
    [path.resolve(__dirname, './fixture-postcss-plugin.js')]: {}
  },
}

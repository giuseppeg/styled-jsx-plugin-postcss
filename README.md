# styled-jsx-plugin-postcss

[![Build Status](https://travis-ci.org/giuseppeg/styled-jsx-plugin-postcss.svg?branch=master)](https://travis-ci.org/giuseppeg/styled-jsx-plugin-postcss)
[![npm](https://img.shields.io/npm/v/styled-jsx-plugin-postcss.svg)](https://www.npmjs.com/package/styled-jsx-plugin-postcss)

Use [PostCSS](https://github.com/postcss/postcss) with
[styled-jsx](https://github.com/zeit/styled-jsx) 💥

⚠️ **This plugin is not actively being maintained. If you want me to work on it please [consider donating](https://github.com/sponsors/giuseppeg).**

## Supporters

Companies and individuals who sponsored some work on this library:

🥇 [@swissredcross](https://github.com/swissredcross)

## Usage

Install this package first.

```bash
npm install --save styled-jsx-plugin-postcss
```

Next, add `styled-jsx-plugin-postcss` to the `styled-jsx`'s `plugins` in your
babel configuration:

```json
{
  "plugins": [
    ["styled-jsx/babel", { "plugins": ["styled-jsx-plugin-postcss"] }]
  ]
}
```

With config:

```json
{
  "plugins": [
    [
      "styled-jsx/babel",
      {
        "plugins": [
          [
            "styled-jsx-plugin-postcss",
            {
              "path": "[PATH_PREFIX]/postcss.config.js",
              "compileEnv": "worker"
            }
          ]
        ]
      }
    ]
  ]
}
```

## compileEnv

When using Node.js v12.3.0 and above the plugin defaults to compiling using a worker thread instead of a child process. This results in faster builds.

If for any reason you want to force compiling using a child process (slower) you can register the plugin with the config option `compileEnv` set to `process`.

### Example with CRA

Usage with Create React App requires you to either _eject_ or use [react-app-rewired](https://github.com/timarney/react-app-rewired).

Here is an example using `react-app-rewired`:

```javascript
// config-overrides.js
// this file overrides the CRA webpack.config

const { getBabelLoader } = require("react-app-rewired");

module.exports = function override(config, env) {
  const loader = getBabelLoader(config.module.rules);

  // Older versions of webpack have `plugins` on `loader.query` instead of `loader.options`.
  const options = loader.options || loader.query;
  options.plugins = [
    [
      "styled-jsx/babel",
      {
        plugins: ["styled-jsx-plugin-postcss"],
      },
    ],
  ].concat(options.plugins || []);
  return config;
};
```

_Note: Please follow their instructions on how to set up build & test scripts, and make sure you have a correctly formatted `postcss.config.js` as well_.

#### Notes

`styled-jsx-plugin-postcss` uses `styled-jsx`'s plugin system which is supported
from version 2. Read more on their repository for further info.

## Plugins

`styled-jsx-plugin-postcss` uses
[`postcss-load-config`](https://www.npmjs.com/package/postcss-load-config)
therefore you may want to refer to their docs to learn more about
[adding plugins](https://www.npmjs.com/package/postcss-load-config#packagejson).

## Contributions

**PRs and contributions are welcome!**

We aim to drive development of this plugin through community contributions.

## License

MIT

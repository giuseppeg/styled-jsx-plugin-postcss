# styled-jsx-plugin-postcss

[![Build Status](https://travis-ci.org/giuseppeg/styled-jsx-plugin-postcss.svg?branch=master)](https://travis-ci.org/giuseppeg/styled-jsx-plugin-postcss)
[![npm](https://img.shields.io/npm/v/styled-jsx-plugin-postcss.svg)](https://www.npmjs.com/package/styled-jsx-plugin-postcss)

Use [PostCSS](https://github.com/postcss/postcss) with
[styled-jsx](https://github.com/zeit/styled-jsx) 💥

## Usage

Install the package first.

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

#### Notes

`styled-jsx-plugin-postcss` uses `styled-jsx`'s plugin system which is supported
from version 2. Read more on their repository for further info.

## Plugins

`styled-jsx-plugin-postcss` uses
[`postcss-load-plugins`](https://www.npmjs.com/package/postcss-load-plugins)
therefore you may want to refer to their docs to learn more about
[adding plugins](https://www.npmjs.com/package/postcss-load-plugins#packagejson).

## Contributions

Although a _Proof Of Concept_ plugin, **PRs and contributions are welcome!** We
aim to drive development of this plugin through community contributions.

## License

MIT

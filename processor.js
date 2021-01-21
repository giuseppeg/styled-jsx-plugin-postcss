const postcss = require("postcss");
const loader = require("postcss-load-config");

const loaderPromises = new Map();

module.exports = function processor(src, options) {
  options = options || {};

  const loaderPromise = loaderPromises.has(options)
    ? loaderPromises.get(options)
    : loader(options.env || process.env, options.path, {
        argv: false,
      }).then((pluginsInfo) => pluginsInfo.plugins || []);

  loaderPromises.set(options, loaderPromise);

  return loaderPromise
    .then((plugins) => postcss(plugins).process(src, { from: false }))
    .then((result) => result.css);
};

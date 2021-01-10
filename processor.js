const postcss = require("postcss");
const loader = require("postcss-load-config");

// export for test import
const NEXTJS_UNSUPPORTED_FIELD_WARNING = `[styled-jsx-plugin-postcss]: Looks like you're using Next.js;
 you may get a warning about unsupported fields in your postcss.config.
 These fields are still read by this plugin for transforming styled-jsx, so it is safe to ignore.
 If you wish to silence this warning, instead insert these extra fields in the options for this plugin.
 See https://github.com/vercel/styled-jsx#css-preprocessing-via-plugins for how to do so.`;

let plugins;
let _processor;

function maybeNextJsWarningInfo(pluginProcessOptions, processOptions) {
  let anyConfigProcessOptions = false;

  for (const key in processOptions) {
    if (!(key in pluginProcessOptions)) {
      anyConfigProcessOptions = true;
      break;
    }
  }

  if (anyConfigProcessOptions) {
    try {
      require("next");
      return NEXTJS_UNSUPPORTED_FIELD_WARNING;
    } catch {}
  }
}

function processor(src, options) {
  const { env: optEnv, path, ...pluginProcessOptions } = options || {};
  let processOptions = {};

  let loaderPromise;
  let maybeWarning;
  if (!plugins) {
    loaderPromise = loader(
      { env: optEnv || process.env, ...pluginProcessOptions },
      path,
      {
        argv: false,
      }
    ).then((pluginsInfo) => {
      plugins = pluginsInfo.plugins || [];
      const { cwd, env, ...processOptions } = pluginsInfo.options;
      maybeWarning = maybeNextJsWarningInfo(
        pluginProcessOptions,
        processOptions
      );
    });
  } else {
    loaderPromise = Promise.resolve();
  }

  return loaderPromise
    .then(() => {
      if (!_processor) {
        _processor = postcss(plugins);
      }

      return _processor.process(src, {
        from: false,
        ...processOptions,
      });
    })
    .then(({ css }) => ({ maybeWarning, css }));
}

module.exports = { processor, NEXTJS_UNSUPPORTED_FIELD_WARNING };

if (require.main == module) {
  let input = "";
  process.stdin.on("data", (data) => {
    input += data.toString();
  });

  process.stdin.on("end", () => {
    const inputData = JSON.parse(input);
    processor(inputData.css, inputData.settings)
      .then((result) => {
        process.stdout.write(JSON.stringify(result));
      })
      .catch((err) => {
        // NOTE: we console.erorr(err) and then process.exit(1) instead of throwing the error
        // to avoid the UnhandledPromiseRejectionWarning message.
        console.error(err);
        process.exit(1);
      });
  });
}

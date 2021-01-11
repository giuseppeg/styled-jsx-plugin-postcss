const { spawnSync } = require("child_process");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

module.exports = (css, settings = { cacheDir: null }) => {
  let cacheFile;
  if (settings.cacheDir) {
    cacheFile = path.join(
      settings.cacheDir,
      crypto.createHash("md5").update(css).digest("hex")
    );

    if (!fs.existsSync(settings.cacheDir)) {
      fs.mkdir(settings.cacheDir, () => {});
    } else if (fs.existsSync(cacheFile)) {
      return fs.readFileSync(cacheFile, "utf8");
    }
  }

  const cssWithPlaceholders = css.replace(
    /%%styled-jsx-placeholder-(\d+)%%/g,
    (_, id) => `/*%%styled-jsx-placeholder-${id}%%*/`
  );

  const result = spawnSync("node", [path.resolve(__dirname, "processor.js")], {
    input: JSON.stringify({
      css: cssWithPlaceholders,
      settings,
    }),
    encoding: "utf8",
  });

  if (result.status !== 0) {
    if (result.stderr.includes("Invalid PostCSS Plugin")) {
      let isNext = false;
      try {
        require.resolve("next");
        isNext = true;
      } catch (err) {}
      if (isNext) {
        console.error(
          "Next.js 9 default postcss support uses a non standard postcss config schema https://err.sh/next.js/postcss-shape, you must use the interoperable object-based format instead https://nextjs.org/docs/advanced-features/customizing-postcss-config"
        );
      }
    }

    throw new Error(`postcss failed with ${result.stderr}`);
  }

  const output = result.stdout.replace(
    /\/\*%%styled-jsx-placeholder-(\d+)%%\*\//g,
    (_, id) => `%%styled-jsx-placeholder-${id}%%`
  );

  if (cacheFile) {
    fs.writeFileSync(cacheFile, output);
  }

  return output;
};

const { spawnSync } = require("child_process");
const path = require("path");
const {
  Worker,
  receiveMessageOnPort,
  MessageChannel,
} = require("worker_threads");
const error = require("./error");

let worker = null;
let unreftimeout = null;

function compileWorker(...args) {
  if (unreftimeout) {
    clearTimeout(unreftimeout);
    unreftimeout = null;
  }

  if (!worker) {
    worker = new Worker(require.resolve("./worker.js"));
  }

  const signal = new Int32Array(new SharedArrayBuffer(4));
  signal[0] = 0;

  try {
    const subChannel = new MessageChannel();
    worker.postMessage({ signal, port: subChannel.port1, args }, [
      subChannel.port1,
    ]);

    const workStartedAt = Date.now();
    const settings = args[1] || {};
    const LOCK_TIMEOUT = settings.lockTimeout || 10000;
    Atomics.wait(signal, 0, 0, LOCK_TIMEOUT);

    const result = receiveMessageOnPort(subChannel.port2);

    if (!result) {
      if (Date.now() - workStartedAt >= LOCK_TIMEOUT) {
        error(
          `postcss is taking more than ${LOCK_TIMEOUT /
            1000}s to compile the following styles:\n\n` +
            `Filename: ${(settings.babel || {}).filename ||
              "unknown filename"}\n\n` +
            args[0]
        );
      }
      error(`postcss' compilation result is undefined`);
    }
    const { message } = result;
    if (message.error) {
      error(`postcss failed with ${message.error}`);
    }
    return message.result;
  } catch (error) {
    throw error;
  } finally {
    unreftimeout = setTimeout(() => {
      worker.unref();
      worker = null;
      unreftimeout = null;
    }, 1000);
  }
}

function compileSubprocess(css, settings) {
  const result = spawnSync("node", [path.resolve(__dirname, "subprocess.js")], {
    input: JSON.stringify({
      css,
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

    error(`postcss failed with ${result.stderr}`);
  }

  return result.stdout;
}

module.exports = (css, settings) => {
  if (
    typeof receiveMessageOnPort === "undefined" ||
    settings.compileEnv === "process"
  ) {
    return compileSubprocess(css, settings);
  } else {
    return compileWorker(css, settings);
  }
};

const { spawnSync } = require("child_process");
const path = require("path");
const {
    Worker,
    receiveMessageOnPort,
    MessageChannel,
} = require("worker_threads");

let worker;

function compileWorker(...args) {
    if (!worker) {
        worker = new Worker("./worker.js");
    }
    const signal = new Int32Array(new SharedArrayBuffer(4));
    signal[0] = 0;

    try {
        const subChannel = new MessageChannel();
        worker.postMessage({ signal, port: subChannel.port1, args }, [
            subChannel.port1,
        ]);
        Atomics.wait(signal, 0, 0);
        return receiveMessageOnPort(subChannel.port2).message.result;
    } catch (error) {
        throw error;
    }
}

function compileSubprocess(css, settings) {
    const result = spawnSync(
        "node",
        [path.resolve(__dirname, "subprocess.js")],
        {
            input: JSON.stringify({
                css,
                settings,
            }),
            encoding: "utf8",
        }
    );

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
    }

    return result.stdout;
}

module.exports = (css, settings) => {
    if (typeof receiveMessageOnPort === "undefined") {
        // console.log("using subprocess mode");
        return compileSubprocess(css, settings);
    } else {
        // console.log("using worker mode");
        return compileWorker(css, settings);
    }
};

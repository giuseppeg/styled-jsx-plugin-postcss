const { parentPort } = require("worker_threads");
const processor = require("./processor");

parentPort.addListener("message", async ({ signal, port, args }) => {
  const result = await processor(...args);
  port.postMessage({ result });
  port.close();
  Atomics.store(signal, 0, 1);
  Atomics.notify(signal, 0);
});

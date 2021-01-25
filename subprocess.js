const processor = require("./processor");

let input = "";
process.stdin.on("data", (data) => {
  input += data.toString();
});

process.stdin.on("end", () => {
  const inputData = JSON.parse(input);
  processor(inputData.css, inputData.settings)
    .then((result) => {
      process.stdout.write(result);
    })
    .catch((err) => {
      // NOTE: we console.error(err) and then process.exit(1) instead of throwing the error
      // to avoid the UnhandledPromiseRejectionWarning message.
      console.error(err);
      process.exit(1);
    });
});

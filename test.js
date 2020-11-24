const assert = require("assert");
const path = require("path");
const plugin = require("./");

describe("styled-jsx-plugin-postcss", () => {
  it("applies browser list and preset-env features", () => {
    assert.strictEqual(
      plugin(
        "p { color: color-mod(red alpha(90%)); & img { display: block } }"
      ),
      "p { color: rgba(255, 0, 0, 0.9) }\np img { display: block }"
    );
  });

  it("applies plugins", () => {
    assert.strictEqual(
      plugin("p { font-size: calc(2 * 20px); }"),
      "p { font-size: 40px; }"
    );
  });

  it("works with placeholders", () => {
    assert.strictEqual(
      plugin(
        "p { color: %%styled-jsx-placeholder-0%%; & img { display: block; } } %%styled-jsx-placeholder-1%%"
      ),
      "p { color: %%styled-jsx-placeholder-0%% } p img { display: block; } %%styled-jsx-placeholder-1%%"
    );
  });

  it("works with @import", () => {
    assert.strictEqual(
      plugin('@import "./fixture.css"; p { color: red }'),
      "div { color: red; } p { color: red }"
    );
  });

  it("works with quotes and other characters", () => {
    assert.strictEqual(
      plugin(`@import "./fixture.css"; * { color: red; font-family: 'Times New Roman'; }
      li:after{ content: "!@#$%^&*()_+"}
      ul li:before{ content: "{res:{res:'korea'}}"; }`),
      `div { color: red; } * { color: red; font-family: 'Times New Roman'; } li:after{ content: "!@#$%^&*()_+"} ul li:before{ content: "{res:{res:'korea'}}"; }`
    );
  });

  it("throws with invalid css", () => {
    assert.throws(
      () => {
        plugin('a {\n  content: "\n}');
      },
      {
        name: "Error",
        message: /postcss failed with CssSyntaxError: <css input>:2:12: Unclosed string/,
      }
    );
  });

  it("throws with invalid config", () => {
    assert.throws(
      () => {
        plugin(
          "p { color: color-mod(red alpha(90%)); & img { display: block } }",
          {
            path: path.resolve("fixture-invalid-config"),
          }
        );
      },
      {
        name: "Error",
        message: /postcss failed with TypeError: Invalid PostCSS Plugin found at: plugins\[0]/,
      }
    );
  });
});

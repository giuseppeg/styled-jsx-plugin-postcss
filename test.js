const assert = require("assert");
const path = require("path");
const plugin = require("./");

describe("styled-jsx-plugin-postcss", () => {
  const compileEnvs = ["process", "worker"];

  compileEnvs.forEach((compileEnv) => {
    describe(`Compiling using a ${compileEnv}`, () => {
      it("applies browser list and preset-env features", () => {
        assert.strictEqual(
          plugin(
            "p { color: color-mod(red alpha(90%)); & img { display: block } }",
            { compileEnv }
          ),
          "p.plugin { color: rgba(255, 0, 0, 0.9) }\np.plugin img.plugin { display: block }"
        );
      });

      it("applies plugins", () => {
        assert.strictEqual(
          plugin("p { font-size: calc(2 * 20px); }", { compileEnv }),
          "p.plugin { font-size: 40px; }"
        );
      });

      it("works with placeholders", () => {
        assert.strictEqual(
          plugin(
            "p { color: %%styled-jsx-placeholder-0%%; & img { display: block; } } %%styled-jsx-placeholder-1%%",
            { compileEnv }
          ),
          "p.plugin { color: %%styled-jsx-placeholder-0%% } p.plugin img.plugin { display: block; } %%styled-jsx-placeholder-1%%"
        );
      });

      it("works with @import", () => {
        assert.strictEqual(
          plugin('@import "./fixture.css"; p { color: red }', { compileEnv }),
          "div.plugin { color: red; } p.plugin { color: red }"
        );
      });

      it("works with quotes and other characters", () => {
        assert.strictEqual(
          plugin(
            `@import "./fixture.css"; * { color: red; font-family: 'Times New Roman'; }
      li:after{ content: "!@#$%^&*()_+"}
      ul li:before{ content: "{res:{res:'korea'}}"; }`,
            { compileEnv }
          ),
          `div.plugin { color: red; } *.plugin { color: red; font-family: 'Times New Roman'; } li:after.plugin{ content: "!@#$%^&*()_+"} ul.plugin li:before.plugin{ content: "{res:{res:'korea'}}"; }`
        );
      });

      it("throws with invalid css", () => {
        assert.throws(
          () => {
            plugin('a {\n  content: "\n}', { compileEnv });
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
                compileEnv,
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
  });
});

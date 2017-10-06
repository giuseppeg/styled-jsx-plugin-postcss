const assert = require('assert')
const plugin = require('./')

describe('styled-jsx-plugin-postcss', () => {
  it('applies plugins', () => {
    assert.equal(
      plugin('p { img { display: block} color: color(red a(90%)) }'),
      'p { color: rgba(255, 0, 0, 0.9); } p img { display: block}'
    )
  })

  it('works with expressions placeholders', () => {
    assert.equal(
      plugin('p { img { display: block } color: %%styled-jsx-expression-1%%; }'),
      'p { color: %%styled-jsx-expression-1%%; } p img { display: block }'
    )
  })

  it('works with @import', () => {
    assert.equal(
      plugin('@import "./fixture.css"; p { color: red }'),
      'div { color: red; } p { color: red }'
    )
  })
})

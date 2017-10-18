const assert = require('assert')
const plugin = require('./')

describe('styled-jsx-plugin-postcss', () => {
  it('applies plugins', () => {
    assert.equal(
      plugin('p { img { display: block} color: color(red a(90%)) }'),
      'p { color: rgba(255, 0, 0, 0.9); } p img { display: block}'
    )
  })

  it('works with placeholders', () => {
    assert.equal(
      plugin('p { img { display: block } color: %%styled-jsx-placeholder-0%%; } %%styled-jsx-placeholder-1%%'),
      'p { color: %%styled-jsx-placeholder-0%%; } p img { display: block } %%styled-jsx-placeholder-1%%'
    )
  })

  it('works with @import', () => {
    assert.equal(
      plugin('@import "./fixture.css"; p { color: red }'),
      'div { color: red; } p { color: red }'
    )
  })
})

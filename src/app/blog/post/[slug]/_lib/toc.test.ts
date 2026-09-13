import assert from 'node:assert/strict'
import test from 'node:test'
import { activeHeadingUrl, flattenToc } from './toc'

test('preserves nested heading order, including repeated titles with unique anchors', () => {
  const child = { title: 'Intro', url: '#intro-1', items: [] }
  const parent = { title: 'Intro', url: '#intro', items: [child] }
  const sibling = { title: 'End', url: '#end', items: [] }
  assert.deepEqual(flattenToc([parent, sibling]), [parent, child, sibling])
  assert.deepEqual(flattenToc([]), [])
})

test('selects the section crossing the heading offset, including jumps past multiple headings', () => {
  const headings = [
    { url: '#first', top: -1000 },
    { url: '#second', top: -500 },
    { url: '#third', top: 96 },
    { url: '#fourth', top: 700 }
  ]
  assert.equal(activeHeadingUrl(headings, 96), '#third')
  assert.equal(activeHeadingUrl(headings, 95), '#second')
  assert.equal(activeHeadingUrl(headings, 800), '#fourth')
})

test('restores the previous section when scrolling upward and handles the article start', () => {
  assert.equal(
    activeHeadingUrl(
      [
        { url: '#first', top: -200 },
        { url: '#second', top: 200 }
      ],
      96
    ),
    '#first'
  )
  assert.equal(activeHeadingUrl([{ url: '#first', top: 500 }], 96), '#first')
  assert.equal(activeHeadingUrl([], 96), '')
})

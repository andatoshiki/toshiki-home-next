import assert from 'node:assert/strict'
import test from 'node:test'

import { findTilHeadingIssue } from './remark-validate-til-headings'

test('accepts headingless and contiguous TIL outlines', () => {
  assert.equal(findTilHeadingIssue([]), null)
  assert.equal(findTilHeadingIssue([1, 2, 3, 2, 1, 2]), null)
})

test('rejects TIL outlines that do not begin at level 1', () => {
  assert.deepEqual(findTilHeadingIssue([2, 3]), {
    index: 0,
    message: 'TIL content headings must begin at level 1'
  })
})

test('rejects skipped TIL heading levels', () => {
  assert.deepEqual(findTilHeadingIssue([1, 3]), {
    index: 1,
    message: 'TIL content headings cannot skip from level 1 to level 3'
  })
})

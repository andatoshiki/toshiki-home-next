import assert from 'node:assert/strict'
import test from 'node:test'

import { getTilContentHeadingLevel } from './til-heading-levels'

test('places TIL content beneath an entry heading on the main page', () => {
  assert.equal(getTilContentHeadingLevel(2, 2), 3)
  assert.equal(getTilContentHeadingLevel(3, 2), 4)
})

test('places TIL content beneath an entry heading on a tag page', () => {
  assert.equal(getTilContentHeadingLevel(2, 3), 4)
  assert.equal(getTilContentHeadingLevel(3, 3), 5)
})

test('caps deeply nested TIL content at heading level 6', () => {
  assert.equal(getTilContentHeadingLevel(6, 2), 6)
  assert.equal(getTilContentHeadingLevel(6, 3), 6)
})

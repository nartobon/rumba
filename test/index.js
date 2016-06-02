
import test from 'ava'

import { createAction } from '../src'

test('should export the right stuff', t => {
  t.truthy(createAction)
})

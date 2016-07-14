import test from 'ava'
import { fromJS } from 'immutable'

import { mergeOptions } from '../src/lib/createAction'

test('mergeOptions should exist', t => {
  t.truthy(mergeOptions)
})

test('mergeOptions should merge correctly', t => {
  const defaults = {
    foo: 1,
    bar: 2,
  }
  const options = {
    foo: 3,
  }

  t.deepEqual(mergeOptions(defaults, options), { foo: 3, bar: 2 })
})

test('should apply defaults and convert non reserved functions to values', t => {
  const defaults = {
    collection: false,
  }
  const options = {
    onResponse: () => 'response',
    onError: () => 'error',
    method: 'GET',
    endpoint: (params) => `${params.string}/test`,
    params: {
      string: '/other',
    },
  }
  const expected = fromJS(options).withMutations((updated) => {
    updated.set('endpoint', '/other/test')
    updated.set('collection', false)
  })

  t.deepEqual(mergeOptions(defaults, options), expected.toJS())
})

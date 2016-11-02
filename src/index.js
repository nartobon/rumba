import { Schema, arrayOf, valuesOf, unionOf } from 'normalizr'

import createAction from './lib/createAction'
import * as reducers from './reducers'


export default {
  Schema,
  arrayOf,
  valuesOf,
  unionOf,

  createAction,
  reducers,
}

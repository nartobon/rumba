import mapValues from 'lodash.mapvalues'
import merge from 'lodash.merge'
import sendRequest from './sendRequest'

const reserved = [
  'onResponse',
  'onError'
]
const result = (fn, arg) => (typeof fn === 'function' ? fn(arg) : fn)

// TODO: check entities cache in store and dont fetch if we have it already

/*
 app must have redux-thunk installed
 possible options:

 - subset (optional)(string)
 - method (required)(get, post, put, delete, or patch)
 - params (object)
 - endpoint (required)(url string)
 - model (required)(normalizr model)
 - collection (default false)(boolean)

 all options can either be a value, or a function that returns a value.
 if you define a function, it will receive options.params as an argument
 */

const isReserved = (k) => reserved.indexOf(k) !== -1

/*
 merge our multitude of option objects together
 defaults = options defined in createAction
 opt = options specified in action creator
 */
export const mergeOptions = (defaults, opt) => mapValues(
  merge({}, defaults, opt),
  (v, k, { params }) => {
    if (isReserved(k)) return v
    return result(v, params)
  }
)

export default (defaults = {}) => (opt = {}) => {
  const options = mergeOptions(defaults, opt)

  if (!options.method) throw new Error('Missing method')
  if (!options.endpoint) throw new Error('Missing endpoint')

  return (dispatch) => sendRequest({ options, dispatch })
}

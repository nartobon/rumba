import mapValues from 'lodash.mapvalues'
import merge from 'lodash.merge'
import sendRequest from './sendRequest'

const reserved = [
  'onResponse',
  'onError',
]
const result = (fn, ...arg) => (typeof fn === 'function' ? fn(...arg) : fn)

// TODO: check entities cache in store and dont fetch if we have it already

/*
 app must have redux-thunk installed
 possible options:

 - onError (optional)(function)
 - onResponse (optional)(function)

 - subset (optional)(string)
 - method (required)(get, post, put, delete, or patch)
 - params (object)
 - endpoint (required)(url string)
 - model (optional)(normalizr model)
 - collection (default false)(boolean)
 - fresh (default to false)(boolean)

 - headers (optional)(object)
 - field (optional)(object)
 - query (optional)(object)
 - body (optional)(object)
 - withCredentials (default false)(boolean)
 - token (optional)(string)
 - locale (optional)(string)
 - auth (optional)(array)


 all options can either be a value, or a function that returns a value.
 if you define a function, it will receive options.params as an argument
 */

const isReserved = k => (reserved.indexOf(k) !== -1)
const noop = () => {}

/*
 merge our multitude of option objects together
 defaults = options defined in createAction
 opt = options specified in action creator
 state = current state of store
 */
export const mergeOptions = (defaults, opt, state) => mapValues(
  merge({}, defaults, opt),
  (v, k, { params }) => {
    if (isReserved(k)) return v
    return result(v, params, state)
  }
)

const createAction = (defaults = {}) => (opt = {}) => (dispatch, getState) => {
  const options = mergeOptions(defaults, opt, getState())

  if (!options.method) throw new Error('Missing method')
  if (!options.endpoint) throw new Error('Missing endpoint')

  const reqPromise = sendRequest({ options, dispatch })
  reqPromise.catch(noop)

  if (options.onResponse) reqPromise.then(options.onResponse, noop)
  if (options.onError) reqPromise.catch(err => options.onError(err, err.response))

  const actionPromise = noop
  actionPromise.then = (resolve, reject) => reqPromise.then(resolve, reject)
  actionPromise.catch = cb => this.then(undefined, cb)

  return actionPromise
}

export default createAction

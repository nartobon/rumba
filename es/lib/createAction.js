import mapValues from 'lodash.mapvalues';
import merge from 'lodash.merge';
import sendRequest from './sendRequest';

var reserved = ['onResponse', 'onError', 'getToken', 'getLocale'];
var result = function result(fn, arg) {
  return typeof fn === 'function' ? fn(arg) : fn;
};

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

 - headers (optional)(function)
 - query (optional)(object)
 - body (optional)(object)
 - withCredentials (default false)(boolean)
 - token (optional)(string)
 - getToken (optional)(function)
 - getLocale (optional)(function)
 - auth (optional)(array)


 all options can either be a value, or a function that returns a value.
 if you define a function, it will receive options.params as an argument
 */

var isReserved = function isReserved(k) {
  return reserved.indexOf(k) !== -1;
};

/*
 merge our multitude of option objects together
 defaults = options defined in createAction
 opt = options specified in action creator
 */
export var mergeOptions = function mergeOptions(defaults, opt) {
  return mapValues(merge({}, defaults, opt), function (v, k, _ref) {
    var params = _ref.params;

    if (isReserved(k)) return v;
    return result(v, params);
  });
};

export default (function () {
  var defaults = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  return function () {
    var opt = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var options = mergeOptions(defaults, opt);

    if (!options.method) throw new Error('Missing method');
    if (!options.endpoint) throw new Error('Missing endpoint');

    return function (dispatch, getState) {
      return sendRequest({ options: options, dispatch: dispatch, getState: getState });
    };
  };
});
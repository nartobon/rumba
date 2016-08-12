import mapValues from 'lodash.mapvalues';
import merge from 'lodash.merge';
import sendRequest from './sendRequest';

var reserved = ['onResponse', 'onError'];
var result = function result(fn) {
  for (var _len = arguments.length, arg = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    arg[_key - 1] = arguments[_key];
  }

  return typeof fn === 'function' ? fn.apply(undefined, arg) : fn;
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
 - locale (optional)(string)
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
 state = current state of store
 */
export var mergeOptions = function mergeOptions(defaults, opt, state) {
  return mapValues(merge({}, defaults, opt), function (v, k, _ref) {
    var params = _ref.params;

    if (isReserved(k)) return v;
    return result(v, params, state);
  });
};

var createAction = function createAction() {
  var defaults = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  return function () {
    var opt = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    return function (dispatch, getState) {
      var options = mergeOptions(defaults, opt, getState());

      if (!options.method) throw new Error('Missing method');
      if (!options.endpoint) throw new Error('Missing endpoint');

      sendRequest({ options: options, dispatch: dispatch });
    };
  };
};

export default createAction;
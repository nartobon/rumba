'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _entify = require('./entify');

var _entify2 = _interopRequireDefault(_entify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (opt) {
  return function (dispatch) {
    dispatch({
      type: 'rumba.request',
      payload: opt
    });

    var req = _superagent2.default[opt.method.toLowerCase()](opt.endpoint);
    var debug = opt.method.toUpperCase() + ' ' + opt.endpoint;

    if (opt.headers) {
      req.set(opt.headers);
    }
    if (opt.query) {
      req.query(opt.query);
    }
    if (opt.body) {
      req.send(opt.body);
    }
    if (opt.withCredentials) {
      req.withCredentials();
    }
    if (opt.token) {
      req.set({ Authorization: 'Bearer ' + opt.token });
    }
    if (opt.auth) {
      req.auth.apply(req, (0, _toConsumableArray3.default)(opt.auth));
    }

    req.end(function (err, res) {
      if (!res && !err) {
        err = new Error('Connection failed: ' + debug);
      }
      if (!err && res.type !== 'application/json') {
        err = new Error('Unknown response type: \'' + res.type + '\' from ' + debug);
      }
      if (err) {
        if (opt.onError) opt.onError(err);
        return dispatch({
          type: 'rumba.failure',
          meta: opt,
          payload: err
        });
      }

      // handle json responses
      if (opt.onResponse) opt.onResponse(res);
      dispatch({
        type: 'rumba.success',
        meta: opt,
        payload: {
          raw: res.body,
          normalized: opt.model ? (0, _entify2.default)(res.body, opt) : null
        }
      });
    });
  };
};

module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.api = undefined;

var _reduxActions = require('redux-actions');

var _immutable = require('immutable');

var _reduceReducers = require('reduce-reducers');

var _reduceReducers2 = _interopRequireDefault(_reduceReducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = (0, _immutable.Map)({
  subsets: (0, _immutable.Map)(),
  entities: (0, _immutable.Map)()
});

// shallow entity state
var addEntities = function addEntities(state, _ref) {
  var normalized = _ref.payload.normalized;

  if (!normalized) return state;
  return (0, _immutable.fromJS)({ entities: normalized.entities }).mergeDeep(state);
};

// subset state
var setResponse = function setResponse(state, _ref2) {
  var subset = _ref2.meta.subset;
  var raw = _ref2.payload.raw;

  if (!subset) return state;
  var path = ['subsets', subset];
  return state.setIn(path, (0, _immutable.fromJS)(raw));
};

var setResponseError = function setResponseError(state, _ref3) {
  var subset = _ref3.meta.subset;
  var payload = _ref3.payload;

  if (!subset) return state;
  return state.setIn(['subsets', subset, 'error'], payload);
};

// exported actions
var api = exports.api = (0, _reduxActions.handleActions)({
  'rumba.success': (0, _reduceReducers2.default)(setResponse, addEntities),
  'rumba.failure': setResponseError
}, initialState);
'use strict';

exports.__esModule = true;
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

var ensureArray = function ensureArray(data) {
  return Array.isArray(data) ? data : [data];
};

// possible solutions:
// - subsets become maps that are basically pointers to existing nodes in the entities store
// - subsets become lists of IDs and entity types

// shallow entity state
var addEntities = function addEntities(state, _ref) {
  var normalized = _ref.payload.normalized;

  if (!normalized) return state;
  return (0, _immutable.fromJS)({ entities: normalized.entities }).mergeDeep(state);
};

// subset state
var createSubset = function createSubset(state, _ref2) {
  var _ref2$payload = _ref2.payload;
  var subset = _ref2$payload.subset;
  var fresh = _ref2$payload.fresh;

  if (!subset) return state;
  var path = ['subsets', subset];
  if (!fresh && state.hasIn(path)) return state;
  var record = (0, _immutable.Map)({
    id: subset,
    pending: true
  });
  return state.setIn(path, record);
};

var setSubsetData = function setSubsetData(state, _ref3) {
  var subset = _ref3.meta.subset;
  var _ref3$payload = _ref3.payload;
  var raw = _ref3$payload.raw;
  var normalized = _ref3$payload.normalized;

  if (!subset) return state;
  var path = ['subsets', subset];
  if (!state.hasIn(path)) return state; // subset doesnt exist
  return state.updateIn(path, function (subset) {
    return subset.set('data', (0, _immutable.fromJS)(raw)).set('entities', normalized ? (0, _immutable.Set)(ensureArray(normalized.result)) : (0, _immutable.Set)()).set('pending', false).set('error', null);
  });
};

var setSubsetError = function setSubsetError(state, _ref4) {
  var subset = _ref4.meta.subset;
  var payload = _ref4.payload;

  if (!subset) return state;
  var path = ['subsets', subset];
  if (!state.hasIn(path)) return state; // subset doesnt exist
  return state.updateIn(path, function (subset) {
    return subset.delete('data').delete('entities').set('error', payload).set('pending', false);
  });
};

// exported actions
var api = exports.api = (0, _reduxActions.handleActions)({ // eslint-disable-line import/prefer-default-export
  'rumba.request': createSubset,
  'rumba.failure': setSubsetError,
  'rumba.success': (0, _reduceReducers2.default)(setSubsetData, addEntities)
}, initialState);
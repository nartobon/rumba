import { handleActions } from 'redux-actions';
import { Map, Set, fromJS } from 'immutable';
import compose from 'reduce-reducers';

var initialState = Map({
  subsets: Map(),
  entities: Map()
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
  // TODO entity not work
  // return fromJS({ entities: normalized.entities }).mergeDeep(state)
  return state.mergeDeep(fromJS({ entities: normalized.entities }));
};

// subset state
var createSubset = function createSubset(state, _ref2) {
  var _ref2$payload = _ref2.payload;
  var subset = _ref2$payload.subset;
  var fresh = _ref2$payload.fresh;

  if (!subset) return state;
  var path = ['subsets', subset];
  if (!fresh && state.hasIn(path)) return state;
  var record = Map({
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
    return subset.set('data', fromJS(raw)).set('entities', normalized ? Set(ensureArray(normalized.result)) : Set()).set('pending', false).set('error', null);
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
export var api = handleActions({ // eslint-disable-line import/prefer-default-export
  'rumba.request': createSubset,
  'rumba.failure': setSubsetError,
  'rumba.success': compose(setSubsetData, addEntities)
}, initialState);
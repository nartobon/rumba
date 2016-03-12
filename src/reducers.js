import { handleActions } from 'redux-actions';
import { Map, fromJS } from 'immutable';
import compose from 'reduce-reducers';

const initialState = Map({
  subsets: Map(),
  entities: Map()
});

// shallow entity state
const addEntities = (state, { payload: { normalized } }) => {
  if (!normalized) return state;
  return fromJS({ entities: normalized.entities }).mergeDeep(state);
};

// subset state
const setResponse = (state, { meta: { subset }, payload: { raw } }) => {
  if (!subset) return state;
  const path = ['subsets', subset];
  return state.setIn(path, fromJS(raw));
};

const setResponseError = (state, { meta: { subset }, payload }) => {
  if (!subset) return state;
  return state.setIn(['subsets', subset, 'error'], payload);
};

// exported actions
export const api = handleActions({
  'rumba.success': compose(setResponse, addEntities),
  'rumba.failure': setResponseError,
}, initialState);

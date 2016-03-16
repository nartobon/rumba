import { handleActions } from 'redux-actions'
import { Map, Set, fromJS } from 'immutable'
import compose from 'reduce-reducers'

const initialState = Map({
  subsets: Map(),
  entities: Map()
})

const ensureArray = (data) =>
  Array.isArray(data) ? data : [ data ]

// possible solutions:
// - subsets become maps that are basically pointers to existing nodes in the entities store
// - subsets become lists of IDs and entity types

// shallow entity state
const addEntities = (state, { payload: { normalized } }) => {
  if (!normalized) return state
  return fromJS({ entities: normalized.entities }).mergeDeep(state)
}

// subset state
const createSubset = (state, { payload: { subset } }) => {
  if (!subset) return state
  const path = [ 'subsets', subset ]
  if (state.hasIn(path)) return state
  const record = Map({
    id: subset,
    pending: true
  })
  return state.setIn(path, record)
}

const setSubsetData = (state, { meta: { subset }, payload: { raw, normalized } }) => {
  if (!subset) return state
  const path = [ 'subsets', subset ]
  if (!state.hasIn(path)) return state // subset doesnt exist
  return state.updateIn(path, (subset) =>
    subset
      .set('data', fromJS(raw))
      .set('entities', Set(ensureArray(normalized.result)))
      .set('pending', false)
      .set('error', null)
  )
}

const setSubsetError = (state, { meta: { subset }, payload }) => {
  if (!subset) return state
  const path = [ 'subsets', subset ]
  if (!state.hasIn(path)) return state // subset doesnt exist
  return state.updateIn(path, (subset) =>
    subset
      .delete('data')
      .delete('entities')
      .set('error', payload)
      .set('pending', false)
  )
}

// exported actions
export const api = handleActions({
  'rumba.request': createSubset,
  'rumba.failure': setSubsetError,
  'rumba.success': compose(setSubsetData, addEntities)
}, initialState)

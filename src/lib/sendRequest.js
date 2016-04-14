import request from 'superagent'
import entify from './entify'

export default (opt) => (dispatch) => {
  dispatch({
    type: 'rumba.request',
    payload: opt
  })

  const req = request[opt.method.toLowerCase()](opt.endpoint)
  const debug = `${opt.method.toUpperCase()} ${opt.endpoint}`

  if (opt.headers) {
    req.set(opt.headers)
  }
  if (opt.query) {
    req.query(opt.query)
  }
  if (opt.body) {
    req.send(opt.body)
  }
  if (opt.withCredentials) {
    req.withCredentials()
  }
  if (opt.token) {
    req.set({ Authorization: `Bearer ${opt.token}` })
  }
  if (opt.auth) {
    req.auth(...opt.auth)
  }

  req.end((err, res) => {
    if (err) {
      return dispatch({
        type: 'rumba.failure',
        meta: opt,
        payload: err
      })
    }

    if (!res) {
      return dispatch({
        type: 'tahoe.failure',
        meta: opt,
        payload: new Error(`Connection failed: ${debug}`)
      })
    }

    // handle json responses
    if (res.type === 'application/json') {
      return dispatch({
        type: 'rumba.success',
        meta: opt,
        payload: {
          raw: res.body,
          normalized: opt.model ? entify(res.body, opt) : null
        }
      })
    }

    dispatch({
      type: 'rumba.failure',
      meta: opt,
      payload: new Error(`Unknown response type: '${res.type}' from ${debug}`)
    })
  })
}

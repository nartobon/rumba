import request from 'superagent'
import entify from './entify'

export default (opt) => (dispatch) => {
  dispatch({
    type: 'rumba.request',
    payload: opt
  })

  let req = request[opt.method.toLowerCase()](opt.endpoint)

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
    req = req.auth(...opt.auth)
  }

  req.end((err, { type, body }) => {
    if (err) {
      return dispatch({
        type: 'rumba.failure',
        meta: opt,
        payload: err
      })
    }

    // handle json responses
    if (type === 'application/json') {
      return dispatch({
        type: 'rumba.success',
        meta: opt,
        payload: {
          raw: body,
          normalized: entify(body, opt)
        }
      })
    }

    dispatch({
      type: 'rumba.failure',
      meta: opt,
      payload: new Error('Unknown response type')
    })
  })
}

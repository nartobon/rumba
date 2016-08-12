import request from 'superagent'
import entify from './entify'

const createResponseHandler = ({ options, dispatch }) => {
  const debug = `${options.method.toUpperCase()} ${options.endpoint}`
  return (err, res) => {
    if (!res && !err) {
      err = new Error(`Connection failed: ${debug}`)
    }
    if (!err && !res.noContent && res.type !== 'application/json') {
      err = new Error(`Unknown response type: '${res.type}' from ${debug}`)
    }
    if (err) {
      dispatch({
        type: 'rumba.failure',
        meta: options,
        payload: err,
      })
      if (options.onError) options.onError(err, res)
      return
    }

    // handle json responses
    dispatch({
      type: 'rumba.success',
      meta: options,
      payload: {
        raw: res.body,
        normalized: options.model && entify(res.body, options),
      },
    })
    if (options.onResponse) options.onResponse(res)
  }
}

const sendRequest = ({ options, dispatch }) => {
  dispatch({
    type: 'rumba.request',
    payload: options,
  })

  const req = request[options.method.toLowerCase()](options.endpoint)

  if (options.headers) {
    req.set(options.headers)
  }
  if (options.query) {
    req.query(options.query)
  }
  if (options.body) {
    req.send(options.body)
  }
  if (options.withCredentials) {
    req.withCredentials()
  }
  if (options.token) {
    req.set({ Authorization: `Bearer ${options.token}` })
  }
  if (options.locale) {
    req.set({ 'Accept-Language': options.locale })
  }
  if (options.auth) {
    req.auth(...options.auth)
  }

  req.end(createResponseHandler({ options, dispatch }))
}

export default sendRequest

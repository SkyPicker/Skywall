import {omitBy, isUndefined, zipObject} from 'lodash'
import {bindActionCreators} from 'redux'
import {connect as originalConnect} from 'react-redux'
import {formatPattern} from 'react-router'
import url from 'url'
import config from '../config'


export function dummyMiddleware() {
  return (next) => (action) => next(action)
}

export function makeAction(type, ...argNames) {
  return function(...args) {
    return {type, ...zipObject(argNames, args)}
  }
}

export function connect(component, mapDispatchToProps, mapStateToProps, options) {
  return originalConnect(mapStateToProps,
    (dispatch) => bindActionCreators(mapDispatchToProps, dispatch), null, options)(component)
}

export function api(point, options) {
  let {data, query, params} = options || {}
  let [method, pathPattern] = point.split(' ', 2)
  let path = formatPattern(pathPattern, params)
  let search = url.format({query: omitBy(query, isUndefined)})
  let hasBody = !['HEAD', 'GET'].includes(method.toUpperCase())
  return fetch(config.api + path + search, {
    method: method,
    headers: (hasBody ? {'Content-type': 'application/json'} : undefined),
    body: (hasBody ? JSON.stringify(data || {}) : undefined),
    credentials: 'same-origin',
  })
    .then((res) => {
      let contentType = res.headers.get('content-type') || ''
      if (contentType.indexOf('application/json') > -1) {
        return res.json().then((data) => ({res, data}))
      } else {
        return res.text().then((data) => ({res, data}))
      }
    })
    .then(({res, data}) => {
      if (res.ok) {
        return data
      } else {
        throw new Error(data && data.error || res.statusText || 'Unknown error')
      }
    })
    .catch((err) => {
      return Promise.reject(err.message || 'Unknown error')
    })
}

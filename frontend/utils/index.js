import url from 'url'
import {omitBy, isUndefined, zipObject} from 'lodash'
import {formatPattern} from 'react-router'
import config from '../config'


export const dummyMiddleware = () => {
  return (next) => (action) => next(action)
}

export const makeAction = (type, ...argNames) => {
  return (...args) => ({type, ...zipObject(argNames, args)})
}

export const api = (point, options) => {
  const {data, query, params} = options || {}
  const [method, pathPattern] = point.split(' ', 2)
  const path = formatPattern(pathPattern, params)
  const search = url.format({query: omitBy(query, isUndefined)})
  const hasBody = !['HEAD', 'GET'].includes(method.toUpperCase())
  return fetch(config.api + path + search, {
    method,
    headers: (hasBody ? {'Content-type': 'application/json'} : {}),
    body: (hasBody ? JSON.stringify(data || {}) : undefined),
    credentials: 'same-origin',
  })
    .then((res) => {
      const contentType = res.headers.get('content-type') || ''
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
}

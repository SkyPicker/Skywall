import 'babel-polyfill'
import 'whatwg-fetch'
import React from 'react'
import {render} from 'react-dom'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import {createLogger} from 'redux-logger'
import config from './config'
import reducer from './reducers'
import Router from './components/Router'
import {dummyMiddleware} from './utils'
import 'bootstrap/dist/css/bootstrap.css'


// Wait for modules to initialize
setTimeout(() => {
  const root = document.getElementById('app')
  const logger = config.devel ? createLogger() : dummyMiddleware
  const store = createStore(reducer(), applyMiddleware(thunk, logger))

  return render(
    <Provider store={store}>
      <Router />
    </Provider>,
    root,
  )
})

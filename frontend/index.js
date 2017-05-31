import 'babel-polyfill'
import 'whatwg-fetch'
import React from 'react'
import {render} from 'react-dom'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import {createLogger} from 'redux-logger'
import {Router, browserHistory} from 'react-router'
import config from './config'
import reducer from './reducers'
import routes from './routes'
import {dummyMiddleware} from './utils'
import 'bootstrap/dist/css/bootstrap.css'


const root = document.getElementById('app')
const logger = config.devel ? createLogger() : dummyMiddleware
const store = createStore(reducer, applyMiddleware(thunk, logger))

// Wait for modules to initialize
setTimeout(() => render(
  <Provider store={store}>
    <Router history={browserHistory}>
      {routes()}
    </Router>
  </Provider>,
  root,
))

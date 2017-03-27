import React from 'react'
import {Route, IndexRoute} from 'react-router'
import App from './components/App'
import WithMenu from './components/WithMenu'
import Dashboard from './components/Dashboard'
import NotFound from './components/NotFound'


export default (
  <Route path="/" component={App}>
    <Route component={WithMenu}>
      <IndexRoute component={Dashboard} />
    </Route>
    <Route path="*" component={NotFound} />
  </Route>
)

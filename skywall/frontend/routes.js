import React from 'react'
import {Route, IndexRoute} from 'react-router'
import * as routes from './constants/routes'
import App from './components/App'
import WithMenu from './components/WithMenu'
import Dashboard from './components/Dashboard'
import Clients from './components/Clients'
import NotFound from './components/NotFound'


export default (
  <Route path="/" component={App}>
    <Route component={WithMenu}>
      <IndexRoute component={Dashboard} />
      <Route path={routes.CLIENTS} component={Clients} />
    </Route>
    <Route path="*" component={NotFound} />
  </Route>
)

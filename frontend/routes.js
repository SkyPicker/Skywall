import React from 'react'
import {Route, IndexRoute} from 'react-router'
import * as routes from './constants/routes'
import App from './components/App'
import WithMenu from './components/WithMenu'
import Dashboard from './components/Dashboard'
import ClientList from './components/ClientList'
import ClientDetail from './components/ClientDetail'
import NotFound from './components/NotFound'
import {FlowSignal} from './utils/signals'


export const routesSignal = new FlowSignal('routesSignal')

export default () => routesSignal.emit(
  <Route path="/" component={App}>
    <Route component={WithMenu}>
      <IndexRoute component={Dashboard} />
      <Route path={routes.CLIENT_LIST}>
        <IndexRoute component={ClientList} />
        <Route path={routes.CLIENT_DETAIL} component={ClientDetail} />
      </Route>
    </Route>
    <Route path="*" component={NotFound} />
  </Route>
)

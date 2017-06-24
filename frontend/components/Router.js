import React from 'react'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'
import {compose} from 'redux'
import * as routes from '../constants/routes'
import {applyOverlays} from '../utils/overlays'
import App from './App'
import WithMenu from './WithMenu'
import Dashboard from './Dashboard'
import ClientList from './ClientList'
import ClientDetail from './ClientDetail'
import GroupList from './GroupList'
import GroupAdd from './GroupAdd'
import GroupDefault from './GroupDefault'
import GroupDetail from './GroupDetail'
import NotFound from './NotFound'


export class RouterComponent extends React.Component {

  static propTypes = {
  }

  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <Route component={WithMenu}>
            <IndexRoute component={Dashboard} />
            <Route path={routes.CLIENT_LIST}>
              <IndexRoute component={ClientList} />
              <Route path={routes.CLIENT_DETAIL} component={ClientDetail} />
            </Route>
            <Route path={routes.GROUP_LIST}>
              <IndexRoute component={GroupList} />
              <Route path={routes.GROUP_ADD} component={GroupAdd} />
              <Route path={routes.GROUP_DEFAULT} component={GroupDefault} />
              <Route path={routes.GROUP_DETAIL} component={GroupDetail} />
            </Route>
          </Route>
          <Route path="*" component={NotFound} />
        </Route>
      </Router>
    )
  }
}

export default compose(
  applyOverlays,
)(RouterComponent)

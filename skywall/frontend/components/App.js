import React from 'react'
import {some} from 'lodash'
import {Grid} from 'react-bootstrap'
import LoadingBar from 'react-loading-bar'
import {connect} from '../utils'
import Alerts from './Alerts'
import Header from './Header'
import 'react-loading-bar/dist/index.css'


class App extends React.Component {

  static propTypes = {
    // Props from store
    isFetching: React.PropTypes.bool.isRequired,

    // Default props
    children: React.PropTypes.element.isRequired,
  }

  render() {
    const {isFetching, children} = this.props
    return (
      <div style={{paddingBottom: '200px'}}>
        <LoadingBar show={isFetching} color="red" />
        <Header />
        <Grid>
          <Alerts />
          {children}
        </Grid>
      </div>
    )
  }
}

export default connect(App, {}, (state) => ({
  isFetching: some(state, (s) => s.isFetching),
}))

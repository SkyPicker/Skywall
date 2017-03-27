import React from 'react'
import {some} from 'lodash'
import {Grid} from 'react-bootstrap'
import LoadingBar from 'react-loading-bar'
import {connect} from '../utils'
import Header from './Header'
import 'react-loading-bar/dist/index.css'


class App extends React.Component {

  static propTypes = {
  }

  render() {
    let {isFetching, children} = this.props
    return (
      <div style={{paddingBottom: '200px'}}>
        <LoadingBar show={isFetching} color="red" />
        <Header />
        <Grid>
          {children}
        </Grid>
      </div>
    )
  }
}

export default connect(App, {}, (state) => ({
  isFetching: some(state, (s) => s.isFetching),
}))

import React from 'react'
import {some} from 'lodash'
import {Grid} from 'react-bootstrap'
import LoadingBar from 'react-loading-bar'
import PropTypes from 'prop-types'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {appRenderSignal} from '../signals'
import signalRender from '../hocs/signalRender'
import Alerts from './Alerts'
import Header from './Header'
import 'react-loading-bar/dist/index.css'


class App extends React.Component {

  static propTypes = {
    // Props from store
    isFetching: PropTypes.bool.isRequired,

    // Default props
    children: PropTypes.node,
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

const mapStateToProps = (state) => ({
  isFetching: some(state, (s) => s.isFetching),
})

const mapDispatchToProps = {
  // Empty
}

export default compose(
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  signalRender(appRenderSignal),
)(App)

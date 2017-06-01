import React from 'react'
import {find} from 'lodash'
import {Row, Col, FormGroup, ControlLabel, Clearfix, Alert} from 'react-bootstrap'
import {If, Choose, When, Otherwise} from 'jsx-control-statements'
import PropTypes from 'prop-types'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {clientUpdate} from '../actions/clients'
import {ClientLabel} from '../fields/clients'
import signalRender from '../hocs/signalRender'
import {RenderSignal} from '../utils/signals'
import {Form} from '../utils/forms'
import {cancelButton, saveButton, editButton} from '../utils/buttons'
import Moment from '../components/visual/Moment'


class ClientDetailForm extends Form {

  static propTypes = {
    // Props from parent element
    client: PropTypes.shape({
      id: PropTypes.number.isRequired,
      created: PropTypes.number,
      label: PropTypes.string,
      connected: PropTypes.bool,
    }).isRequired,

    // Props from store
    connections: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      clientId: PropTypes.number,
      lastActivity: PropTypes.number,
    })),
    reports: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      clientId: PropTypes.number,
      created: PropTypes.number,
    })),
    isFetching: React.PropTypes.bool,

    // Actions
    clientUpdate: PropTypes.func.isRequired,
  }

  initFields() {
    return {
      label: new ClientLabel({initial: () => this.props.client.label}),
    }
  }

  save(values) {
    const clientId = this.props.client.id
    const {label} = values
    return this.props.clientUpdate(clientId, {label})
      .then(({ok}) => ({ok, stopEditing: ok}))
  }

  isFetching() {
    return this.props.isFetching
  }

  render() {
    const {label} = this.fields
    const {client, connections, reports} = this.props
    const connection = find(connections, {clientId: client.id})
    const report = find(reports, {clientId: client.id})
    return (
      <div>
        <h2>Client #{client.id}</h2>
        <If condition={!client.connected}>
          <Alert bsStyle="warning">
            Client #{client.id} is not connected right now.
          </Alert>
        </If>
        <form onSubmit={this.handleSubmit}>
          <Row>
            <Col md={4}>
              <FormGroup>
                <ControlLabel>First connection</ControlLabel>
                <div>
                  <Moment at={client.created} />
                </div>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <ControlLabel>Last activity</ControlLabel>
                <div>
                  <Choose>
                    <When condition={connection}>
                      <Moment at={connection.lastActivity} />
                    </When>
                    <Otherwise>
                      Never
                    </Otherwise>
                  </Choose>
                </div>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <ControlLabel>Last report</ControlLabel>
                <div>
                  <Choose>
                    <When condition={report}>
                      <Moment at={report.created} />
                    </When>
                    <Otherwise>
                      Never
                    </Otherwise>
                  </Choose>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={12}>{label.render()}</Col>
          </Row>
          <Row>
            <Col md={12}>
              <Clearfix>
                <FormGroup className="pull-right">
                  {cancelButton({form: this})}
                  {saveButton({form: this})}
                  {editButton({form: this})}
                </FormGroup>
              </Clearfix>
            </Col>
          </Row>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  connections: state.clients.connections,
  reports: state.clients.reports,
  isFetching: state.fetching.clientUpdate,
})

const mapDispatchToProps = {
  clientUpdate,
}

export const clientDetailFormRenderSignal = new RenderSignal('clientDetailFormRenderSignal')

export default compose(
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  signalRender(clientDetailFormRenderSignal),
)(ClientDetailForm)

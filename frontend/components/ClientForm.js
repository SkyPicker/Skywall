import React from 'react'
import {Row, Col, FormGroup, ControlLabel, Clearfix} from 'react-bootstrap'
import {Choose, When, Otherwise} from 'jsx-control-statements'
import PropTypes from 'prop-types'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import moment from 'moment'
import {clientUpdate} from '../actions/clientUpdate'
import {ClientLabel} from '../fields/clients'
import {clientFormRenderSignal} from '../signals'
import signalRender from '../hocs/signalRender'
import {Form} from '../utils/forms'
import {cancelButton, saveButton, editButton} from '../utils/buttons'
import Moment from '../components/common/Moment'


class ClientForm extends Form {

  static propTypes = {
    // Props from parent element
    client: PropTypes.shape({
      id: PropTypes.number.isRequired,
      created: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
    }),
    connection: PropTypes.shape({
      id: PropTypes.number.isRequired,
      lastActivity: PropTypes.number.isRequired,
    }),
    report: PropTypes.shape({
      id: PropTypes.number.isRequired,
      created: PropTypes.number.isRequired,
    }),

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

  render() {
    const {label} = this.fields
    const {client, connection, report} = this.props
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <Row>
            <Col md={4}>
              <FormGroup>
                <ControlLabel>First connection</ControlLabel>
                <div>
                  <Moment at={moment.unix(client.created)} />
                </div>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <ControlLabel>Last activity</ControlLabel>
                <div>
                  <Choose>
                    <When condition={connection}>
                      <Moment at={moment.unix(connection.lastActivity)} />
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
                      <Moment at={moment.unix(report.created)} />
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
  isFetching: state.clientUpdate.isFetching,
})

const mapDispatchToProps = {
  clientUpdate,
}

export default compose(
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  signalRender(clientFormRenderSignal),
)(ClientForm)

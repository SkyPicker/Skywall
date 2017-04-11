import React from 'react'
import {Row, Col, FormGroup, ControlLabel, Clearfix} from 'react-bootstrap'
import {Choose, When, Otherwise} from 'jsx-control-statements'
import moment from 'moment'
import {clientUpdate} from '../actions/clientUpdate'
import {ClientLabel} from '../fields/clients'
import {Form} from '../utils/forms'
import {cancelButton, saveButton, editButton} from '../utils/buttons'
import {connect} from '../utils'
import Moment from '../components/common/Moment'


class ClientForm extends Form {

  static propTypes = {
    // Props from parent element
    client: React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      created: React.PropTypes.number.isRequired,
      label: React.PropTypes.string.isRequired,
    }),
    report: React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      created: React.PropTypes.number.isRequired,
    }),

    // Actions
    clientUpdate: React.PropTypes.func.isRequired,
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
    const {client, report} = this.props
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <Row>
            <Col md={12}>
              <FormGroup>
                <ControlLabel>First connection</ControlLabel>
                <div>
                  <Moment at={moment.unix(client.created)} />
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
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

export default connect(ClientForm, {clientUpdate}, (state) => ({
  isFetching: state.clientUpdate.isFetching,
}))

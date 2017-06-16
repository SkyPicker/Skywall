import React from 'react'
import {Row, Col, FormGroup, Clearfix, Button} from 'react-bootstrap'
import PropTypes from 'prop-types'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as routes from '../constants/routes'
import {groupUpdate, groupDelete} from '../actions/groups'
import {GroupName, GroupDescription} from '../fields/groups'
import signalRender from '../hocs/signalRender'
import {RenderSignal} from '../utils/signals'
import {Form} from '../utils/forms'
import {cancelButton, saveButton, editButton} from '../utils/buttons'


/** @extends React.Component */
class GroupDetailForm extends Form {

  static propTypes = {
    // Props from parent element
    group: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
      description: PropTypes.string,
    }).isRequired,

    // Props from store
    groups: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
    })),
    isFetching: React.PropTypes.bool,

    // Actions
    groupUpdate: PropTypes.func.isRequired,
    groupDelete: PropTypes.func.isRequired,
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.delete = this.delete.bind(this)
  }

  initFields() {
    return {
      name: new GroupName({
        initial: () => this.props.group.name,
        group: () => this.props.group,
        groups: () => this.props.groups,
      }),
      description: new GroupDescription({
        initial: () => this.props.group.description,
      }),
    }
  }

  save(values) {
    const {group, groupUpdate} = this.props
    const {name, description} = values
    return groupUpdate(group.id, {name, description})
      .then(({ok}) => ({ok, stopEditing: ok}))
  }

  delete() {
    const {group, groupDelete} = this.props
    return groupDelete(group.id)
      .then((ok) => ok && this.context.router.push(routes.GROUP_LIST))
  }

  isFetching() {
    return this.props.isFetching
  }

  render() {
    const {name, description} = this.fields
    const {group} = this.props
    return (
      <div>
        <h2>Group #{group.id}</h2>
        <form onSubmit={this.handleSubmit}>
          <Row>
            <Col md={6}>{name.render()}</Col>
            <Col md={6}>{description.render()}</Col>
          </Row>
          <Row>
            <Col md={12}>
              <Clearfix>
                <Button bsStyle="danger" onClick={this.delete}>
                  Delete
                </Button>
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
  groups: state.clients.data.groups,
  isFetching: state.fetching.groupUpdate,
})

const mapDispatchToProps = {
  groupUpdate,
  groupDelete,
}

export const groupDetailFormRenderSignal = new RenderSignal('groupDetailFormRenderSignal')

export default compose(
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  signalRender(groupDetailFormRenderSignal),
)(GroupDetailForm)

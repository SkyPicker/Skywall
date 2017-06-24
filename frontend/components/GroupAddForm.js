import React from 'react'
import {Row, Col, FormGroup, Clearfix} from 'react-bootstrap'
import {formatPattern} from 'react-router'
import PropTypes from 'prop-types'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as routes from '../constants/routes'
import {groupAdd} from '../actions/groups'
import {GroupName, GroupDescription} from '../fields/groups'
import {applyOverlays} from '../utils/overlays'
import {Form} from '../utils/forms'
import {resetButton, saveButton} from '../utils/buttons'


/** @extends React.Component */
export class GroupAddFormComponent extends Form {

  static propTypes = {
    // Props from store
    groups: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
    })),
    isFetching: React.PropTypes.bool,

    // Actions
    groupAdd: PropTypes.func.isRequired,
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  initFields() {
    return {
      name: new GroupName({
        groups: () => this.props.groups,
      }),
      description: new GroupDescription(),
    }
  }

  save(values) {
    const {groupAdd} = this.props
    const {name, description} = values
    return groupAdd({name, description})
  }

  saved(data) {
    const {groupId} = data
    const url = formatPattern(routes.GROUP_DETAIL, {groupId})
    this.context.router.push(url)
  }

  isFetching() {
    return this.props.isFetching
  }

  render() {
    const {name, description} = this.fields
    return (
      <div>
        <h2>Add Group</h2>
        <form onSubmit={this.handleSubmit}>
          <Row>
            <Col md={6}>{name.render()}</Col>
            <Col md={6}>{description.render()}</Col>
          </Row>
          <Row>
            <Col md={12}>
              <Clearfix>
                <FormGroup className="pull-right">
                  {resetButton({form: this})}
                  {saveButton({form: this})}
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
  isFetching: state.fetching.groupAdd,
})

const mapDispatchToProps = {
  groupAdd,
}

export default compose(
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  applyOverlays,
)(GroupAddFormComponent)

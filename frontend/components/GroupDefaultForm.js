import React from 'react'
import {Row, Col, FormGroup, ControlLabel, FormControl} from 'react-bootstrap'
import {compose} from 'redux'
import signalRender from '../hocs/signalRender'
import {RenderSignal} from '../utils/signals'
import {defaultGroupLabel, defaultGroupDescription} from '../utils/humanize'


class GroupDefaultForm extends React.Component {

  static propTypes = {
    // Empty
  }

  render() {
    return (
      <div>
        <h2>Default Group</h2>
        <Row>
          <Col md={6}>
            <FormGroup>
              <ControlLabel>Name *</ControlLabel>
              <FormControl type="text" value={defaultGroupLabel} disabled />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl type="text" value={defaultGroupDescription} disabled />
            </FormGroup>
          </Col>
        </Row>
      </div>
    )
  }
}

export const groupDefaultFormRenderSignal = new RenderSignal('groupDefaultFormRenderSignal')

export default compose(
  signalRender(groupDefaultFormRenderSignal),
)(GroupDefaultForm)

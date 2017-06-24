import React from 'react'
import {Row, Col, FormGroup, ControlLabel, FormControl} from 'react-bootstrap'
import {compose} from 'redux'
import {applyOverlays} from '../utils/overlays'
import {defaultGroupLabel, defaultGroupDescription} from '../utils/humanize'


export class GroupDefaultFormComponent extends React.Component {

  static propTypes = {
    // Empty
  }

  render() {
    return (
      <div>
        <h2>Group: {defaultGroupLabel}</h2>
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

export default compose(
  applyOverlays,
)(GroupDefaultFormComponent)

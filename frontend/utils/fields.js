import React from 'react'
import {If} from 'jsx-control-statements'
import {FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap'
import {Field} from './forms'


export class TextField extends Field {
  constructor(opts = {}) {
    super(opts)
    this.opts.type = opts.type || 'text'
  }
  render() {
    return (
      <FormGroup
          controlId={this.key}
          validationState={this.validationState()}
      >
        <If condition={this.opts.label !== null}>
          <ControlLabel>{this.opts.label}</ControlLabel>
        </If>
        <FormControl
            type={this.opts.type}
            value={this.value() || ''}
            onChange={this.handleChange}
            disabled={!this.isEditing()}
        />
        <FormControl.Feedback />
        <HelpBlock>{this.validationHelp()}</HelpBlock>
      </FormGroup>
    )
  }
}

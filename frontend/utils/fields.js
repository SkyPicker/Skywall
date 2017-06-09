import React from 'react'
import {If} from 'jsx-control-statements'
import {FormGroup, ControlLabel, FormControl, HelpBlock, Checkbox} from 'react-bootstrap'
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

export class CheckBoxField extends Field {
  constructor(opts = {}) {
    super({
      format: (value) => Boolean(value),
      ...opts,
    })
  }
  handleChange(e) {
    this.form.change(this.key, e.target.checked)
  }
  render() {
    return (
      <FormGroup
          controlId={this.key}
          validationState={this.validationState()}
      >
        <Checkbox
            checked={this.value() || false}
            onChange={this.handleChange}
            disabled={!this.isEditing()}
        >
          {this.opts.label}
        </Checkbox>
        <FormControl.Feedback />
        <HelpBlock>{this.validationHelp()}</HelpBlock>
      </FormGroup>
    )
  }
}

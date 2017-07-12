import React from 'react'
import {If} from 'jsx-control-statements'
import {FormGroup, ControlLabel, FormControl, HelpBlock, Checkbox} from 'react-bootstrap'
import {Link} from 'react-router'
import Select from 'react-select'
import {NBSP} from '../constants/symbols'
import {Field} from './forms'
import 'react-select/dist/react-select.css'


export class TextField extends Field {
  constructor(opts = {}) {
    super(opts)
    this.opts.type = opts.type || 'text'
    this.opts.placeholder = opts.placeholder || null
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
            placeholder={this.opts.placeholder}
            onChange={this.handleChange}
            disabled={!this.isEditing()}
        />
        <HelpBlock>{this.validationHelp()}</HelpBlock>
      </FormGroup>
    )
  }
}

export class SelectBox extends Field {
  constructor(opts = {}) {
    super(opts)
    this.opts.options = opts.options || (() => [])
    this.opts.show = opts.show || (() => null)
  }
  handleChange(value) {
    this.form.change(this.key, value && value.value || '')
  }
  render() {
    return (
      <FormGroup
          controlId={this.key}
          validationState={this.validationState()}
      >
        <If condition={this.opts.label !== null}>
          <ControlLabel>
            {this.opts.label}
            <If condition={!this.isEditing() && this.isValid() && this.opts.show(this.value())}>
              {NBSP}
              (<Link to={this.opts.show(this.value())}>show</Link>)
            </If>
          </ControlLabel>
        </If>
        <Select
            value={this.value() || ''}
            options={this.opts.options()}
            onChange={this.handleChange}
            disabled={!this.isEditing()}
            menuContainerStyle={{zIndex: 4}}
        />
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
        <HelpBlock>{this.validationHelp()}</HelpBlock>
      </FormGroup>
    )
  }
}

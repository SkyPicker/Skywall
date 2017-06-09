import React from 'react'
import {every, some, assign, forEach, mapValues} from 'lodash'
import PropTypes from 'prop-types'


export class Form extends React.Component {
  static propTypes = {
    inactive: PropTypes.bool,
    registerDirty: PropTypes.func,
  }
  constructor(props) {
    super(props)
    this.isFormMounted = null
    this.unregisterDirty = null
    this.fields = this.initFields()
    forEach(this.fields, (field, key) => {
      field.form = this
      field.key = key
    })
    this.state = {
      isEditing: !this.props.inactive,
      isSaved: false,
      values: this.initial(),
    }
    this.handleEdit = this.handleEdit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount() {
    this.isFormMounted = true
    if (this.props.registerDirty) {
      this.unregisterDirty = this.props.registerDirty(() => this.dirty())
    }
  }
  componentWillUnmount() {
    if (this.unregisterDirty) {
      this.unregisterDirty()
      this.unregisterDirty = null
    }
    this.isFormMounted = false
  }
  initial() {
    return mapValues(this.fields, (field) => field.initial())
  }
  isValid() {
    return every(this.fields, (field) => field.isValid())
  }
  isChanged() {
    return !this.state.isSaved && some(this.fields, (field) => field.isChanged())
  }
  dirty() {
    if (this.isChanged()) {
      return 'Changes were not saved and will be lost. Do you wish to continue?'
    }
  }
  change(key, value) {
    this.setState({
      isSaved: false,
      values: assign({}, this.state.values, {[key]: value}),
    })
  }
  edit() {
    this.setState({
      isEditing: true,
    })
  }
  cancel() {
    this.setState({
      isEditing: false,
      isSaved: false,
      values: this.initial(),
    })
  }
  reset() {
    this.setState({
      isSaved: false,
      values: this.initial(),
    })
  }
  handleEdit = (e) => {
    e.preventDefault()
    this.edit()
  }
  handleCancel = (e) => {
    e.preventDefault()
    this.cancel()
  }
  handleReset = (e) => {
    e.preventDefault()
    this.reset()
  }
  handleSubmit = (e) => {
    e.preventDefault()
    const formattedValues = mapValues(this.fields, (field) => field.formattedValue())
    this.save(formattedValues).then(({ok, data, stopEditing}) => {
      if (this.isFormMounted) {
        this.setState({
          isEditing: this.state.isEditing && !stopEditing,
          isSaved: ok,
        })
      }
      if (ok) this.saved(data)
    })
  }
  // For a subclass to implement
  initFields() {
    throw new Error('Implement this.initFields()')
  }
  save(values) {
    throw new Error('Implement this.save()')
  }
  saved(data) {
    // Empty
  }
  isFetching() {
    return false
  }
}

export class Field {
  constructor(opts = {}) {
    this.form = null
    this.key = null
    this.opts = {
      label: opts.label || null,
      initial: opts.initial || (() => null),
      parse: opts.parse || ((saved) => saved),
      format: opts.format || ((value) => value || ''),
      validate: opts.validate || ((value) => ({valid: true, state: 'success'})),
      compare: opts.compare || ((formattedValue, formattedOther) => formattedValue === formattedOther),
    }
    this.handleChange = this.handleChange.bind(this)
  }
  initial() {
    return this.opts.parse(this.opts.initial())
  }
  formattedInitial() {
    return this.opts.format(this.initial())
  }
  value() {
    return this.form.state.values[this.key]
  }
  formattedValue() {
    return this.opts.format(this.value())
  }
  validate() {
    return this.opts.validate(this.value())
  }
  compare(formattedOther) {
    return this.opts.compare(this.formattedValue(), formattedOther)
  }
  isEditing() {
    return this.form.state.isEditing
  }
  isValid() {
    return this.validate().valid
  }
  isChanged() {
    return !this.compare(this.formattedInitial())
  }
  validationState() {
    if (!this.isEditing()) return null
    if (this.value() === null) return null
    const {state} = this.validate()
    if (state === 'success' && !this.isChanged()) return null
    return state
  }
  validationHelp() {
    if (this.value() === null) return null
    return this.validate().help
  }
  handleChange(e) {
    this.form.change(this.key, e.target.value)
  }
  // For a subclass to implement
  render() {
    throw new Error('Implement this.render()')
  }
}

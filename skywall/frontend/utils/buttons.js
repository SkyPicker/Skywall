import React from 'react'
import {If} from 'jsx-control-statements'
import {Button} from 'react-bootstrap'


export const editButton = ({form, label}) => {
  return (
    <If condition={!form.state.isEditing}>
      <Button bsStyle="primary" onClick={form.handleEdit} disabled={form.props.isFetching}>
        {label || 'Edit'}
      </Button>
      {' '}
    </If>
  )
}

editButton.propTypes = {
  form: React.PropTypes.object.isRequired,
  label: React.PropTypes.string.isRequired,
}

export const cancelButton = ({form, label}) => {
  return (
    <If condition={form.state.isEditing}>
      <Button bsStyle="default" onClick={form.handleCancel} disabled={form.props.isFetching}>
        {label || 'Cancel'}
      </Button>
      {' '}
    </If>
  )
}

cancelButton.propTypes = {
  form: React.PropTypes.object.isRequired,
  label: React.PropTypes.string.isRequired,
}

export const saveButton = ({form, label, allowUnchanged}) => {
  return (
    <If condition={form.state.isEditing}>
      <Button
          bsStyle="primary" type="submit"
          disabled={form.props.isFetching || (!allowUnchanged && !form.isChanged()) || !form.isValid()}
      >
        {label || 'Save'}
      </Button>
      {' '}
    </If>
  )
}

saveButton.propTypes = {
  form: React.PropTypes.object.isRequired,
  label: React.PropTypes.string.isRequired,
  allowUnchanged: React.PropTypes.bool,
}

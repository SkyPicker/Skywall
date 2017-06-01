import React from 'react'
import {If} from 'jsx-control-statements'
import {Button} from 'react-bootstrap'
import PropTypes from 'prop-types'


export const editButton = ({form, label}) => {
  return (
    <If condition={!form.state.isEditing}>
      <Button bsStyle="primary" onClick={form.handleEdit} disabled={form.isFetching()}>
        {label || 'Edit'}
      </Button>
      {' '}
    </If>
  )
}

editButton.propTypes = {
  form: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
}

export const cancelButton = ({form, label}) => {
  return (
    <If condition={form.state.isEditing}>
      <Button bsStyle="default" onClick={form.handleCancel} disabled={form.isFetching()}>
        {label || 'Cancel'}
      </Button>
      {' '}
    </If>
  )
}

cancelButton.propTypes = {
  form: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
}

export const saveButton = ({form, label, allowUnchanged}) => {
  return (
    <If condition={form.state.isEditing}>
      <Button
          bsStyle="primary" type="submit"
          disabled={form.isFetching() || (!allowUnchanged && !form.isChanged()) || !form.isValid()}
      >
        {label || 'Save'}
      </Button>
      {' '}
    </If>
  )
}

saveButton.propTypes = {
  form: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  allowUnchanged: PropTypes.bool,
}

import React, { PropTypes } from 'react'
import { Field } from 'redux-form/immutable'
import FieldInput from 'components/FieldInput'

const pp = data => console.warn(`onSubmit: data =`, data)

const LogIn = ({
  handleSubmit,
  user,
}) =>
  <form onSubmit={handleSubmit}>
    <Field component={FieldInput} name="username" type="text" label="Username" />
    <Field component={FieldInput} name="password" type="password" label="Password" />
    <button type="submit" disabled={false}>Submit</button>
  </form>

LogIn.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  // user: UserType.isRequired,
  user: PropTypes.object.isRequired,
}

export default LogIn

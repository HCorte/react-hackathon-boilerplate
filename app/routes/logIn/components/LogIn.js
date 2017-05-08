import React, { PropTypes } from 'react'
import { Field } from 'redux-form/immutable'
import FieldInput from 'components/FieldInput'

const LogIn = ({
  handleSubmit,
  me,
}) =>
  <form onSubmit={handleSubmit}>
    <Field component={FieldInput} name="username" type="text" label="Username" />
    <Field component={FieldInput} name="password" type="password" label="Password" />
    <button type="submit" disabled={me.isLoading}>Submit</button>
  </form>

LogIn.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  me: PropTypes.object.isRequired,
}

export default LogIn

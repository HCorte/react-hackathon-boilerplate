import React, { PropTypes } from 'react'
import { Field } from 'redux-form/immutable'
import FieldInput from 'components/FieldInput'

const SignMeUp = ({
  handleSubmit,
  me,
}) =>
  <form onSubmit={handleSubmit}>
    <h1>Sign Me Up</h1>
    <Field component={FieldInput} name="username" type="text" label="Username" />
    <Field component={FieldInput} name="password" type="password" label="Password" />
    <Field component={FieldInput} name="email" type="text" label="Email" />
    <button type="submit" disabled={me.isLoading}>Submit</button>
  </form>

SignMeUp.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  me: PropTypes.object.isRequired,
}

export default SignMeUp

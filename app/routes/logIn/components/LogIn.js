import React, { PropTypes } from 'react'
import { Field } from 'redux-form/immutable'

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <label htmlFor={label}>{label}</label>
    <div>
      <input {...input} type={type} placeholder={label} id={label} />
      {touched && error && <span>{error}</span>}
    </div>
  </div>
)

renderField.propTypes = {
  input: PropTypes.any.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.any,
  }),
}

const LogIn = ({
  logInUserRequest,
  // user,
}) =>
  <form onSubmit={logInUserRequest}>
    <Field component={renderField} name="username" type="text" label="Username" />
    <Field component={renderField} name="password" type="password" label="Password" />
    <button type="submit" disabled={false}>Submit</button>
  </form>

LogIn.propTypes = {
  logInUserRequest: PropTypes.func.isRequired,
  // user: UserType.isRequired,
}

export default LogIn

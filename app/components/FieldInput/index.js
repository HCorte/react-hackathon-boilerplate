import React, { PropTypes } from 'react'

const FieldInput = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <label htmlFor={label}>{label}</label>
    <div>
      <input {...input} type={type} placeholder={label} id={label} />
      {touched && error && <span>{error}</span>}
    </div>
  </div>
)

FieldInput.propTypes = {
  input: PropTypes.any.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.any,
  }),
}

export default FieldInput

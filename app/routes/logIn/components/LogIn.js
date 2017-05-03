import React, { PropTypes } from 'react'

const LogIn = props => {
  return (
    <div>
      <h1>LogIn should go here</h1>
    </div>
  )
}

LogIn.proptTypes = {
  logInUserRequest: PropTypes.func.isRequired,
}

export default LogIn

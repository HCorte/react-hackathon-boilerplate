import React from 'react'
import LogMeOut from 'containers/LogMeOut'
import LogMeIn from './LogMeIn'

const LogMe = props => props.me.get('token')
  ? <LogMeOut {...props} />
  : <LogMeIn {...props} />

LogMe.propTypes = {
}

export default LogMe

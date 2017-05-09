import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { requests } from 'modules/me'

const LogMeOut = ({ logMeOut }) =>
  <button onClick={logMeOut}>log me out</button>

LogMeOut.propTypes = {
  logMeOut: PropTypes.func.isRequired,
}

const mapStateToProps = () => ({
})

// FIXME: load epic
const mapDispatchToProps = dispatch => ({
  // logMeOut: () => dispatch(requests.logMeOutRequest()),
  logMeOut: () => {
    // FIXME: remove epic for this to work
    // dispatch({ type: 'LOG_IN_USER_REQUEST' })
    dispatch({ type: 'LOG_ME_OUT_REQUEST_WTF' })
    return fetch('/api/logout', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      // .then(response => response.json())
      /*
      .then(response => {
        console.warn(`logMeOut: response =`, response)
        return response.json()
      })
      */
      .then(payload => {
        dispatch({
          type: `LOG_ME_OUT_SUCCESS`,
          payload,
        })
      })
      .catch(payload => dispatch({
        type: `LOG_ME_OUT_FAILURE`,
        payload,
      }))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(LogMeOut)

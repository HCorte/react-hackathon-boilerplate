import { connect } from 'react-redux'
import { reduxForm } from 'redux-form/immutable'

import LogMe from '../components/LogMe'
import { requests } from '../modules/logMeIn'

const validate = values => {
  // IMPORTANT: values is an Immutable.Map here!
  const errors = {}
  if (!values.get('username')) {
    errors.username = 'Required'
  } else if (values.get('username').length > 15) {
    errors.username = 'Must be 15 characters or less'
  }
  return errors
}

const LogMeIn = reduxForm({
  form: 'logMeIn', // a unique name for this form
  validate,
})(LogMe)

const mapStateToProps = () => ({
})

const mapDispatchToProps = dispatch => ({
  // FIXME: This places the password in the redux stack, this seems a really bad idea
  // onSubmit: payload => dispatch(requests.logMeInRequest(payload)),
  onSubmit: body => {
    // FIXME: remove epic for this to work
    // dispatch({ type: 'LOG_IN_USER_REQUEST' })
    dispatch({ type: 'LOG_IN_REQUEST' })
    return fetch('/api/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(response => response.json())
      /*
      .then(response => {
        console.warn(`response =`, response)
        return response.json()
      })
      */
      .then(payload => {
        if (payload.error) throw (payload)
        localStorage.setItem(`me`, JSON.stringify(payload))
        dispatch({
          type: `LOG_ME_IN_SUCCESS`,
          payload,
        })
      })
      .catch(payload => dispatch({
        type: `LOG_ME_IN_FAILURE`,
        payload,
      }))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(LogMeIn)

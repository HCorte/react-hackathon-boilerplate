import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form/immutable'

import LogInComponent from '../components/LogIn'
import { requests } from '../modules/logIn'

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

const LogIn = reduxForm({
  form: 'logIn', // a unique name for this form
  validate,
})(LogInComponent)

const mapStateToProps = () => ({
})

const mapDispatchToProps = dispatch => ({
  onSubmit: payload => dispatch(requests.logInUserRequest(payload)),
  // FIXME: This is an ugly hack, and should be replaced asap
  /*
  onSubmit: body => {
    dispatch({ type: 'LOG_IN_REQUEST' })
    return fetch('/api/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      // .then(response => response.json())
      .then(response => {
        console.warn(`response =`, response)
        return response.json()
      })
      .then(payload => dispatch({
        type: `LOG_IN_USER_SUCCESS`,
        payload,
      }))
      .catch(payload => dispatch({
        type: `LOG_IN_USER_FAILURE`,
        payload,
      }))
  },
  */
})

export default connect(mapStateToProps, mapDispatchToProps)(LogIn)

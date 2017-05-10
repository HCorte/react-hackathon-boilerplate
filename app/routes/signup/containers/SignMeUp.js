import { connect } from 'react-redux'
import { reduxForm } from 'redux-form/immutable'

import SignMeUpComponent from '../components/SignMeUp'
import { requests } from '../modules/signMeUp'

const validate = values => {
  // IMPORTANT: values is an Immutable.Map here!
  const errors = {}
  if (!values.get('username')) {
    errors.username = 'Required'
  } else if (values.get('username').length > 15) {
    errors.username = 'Must be 15 characters or less'
  }

  if (!values.get('email')) {
    errors.username = 'Required'
  }

  if (!values.get('password')) {
    errors.password = 'Required'
  } else if (values.get('password').length < 6) {
    errors.username = 'Must be 6 characters or more'
  }

  return errors
}

const SignMeUp = reduxForm({
  form: 'signMeUp', // a unique name for this form
  validate,
})(SignMeUpComponent)

const mapStateToProps = () => ({
})

const mapDispatchToProps = dispatch => ({
  // FIXME: This places the password in the redux stack, this seems a really bad idea
  // onSubmit: payload => dispatch(requests.signMeUpRequest(payload)),
  onSubmit: body => {
    // FIXME: remove epic for this to work
    dispatch({ type: 'SIGN_ME_UP_REQUEST_2' })
    return fetch('/api/signup', {
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
      .then(payload => {
        localStorage.setItem(`me`, JSON.stringify(payload))
        dispatch({
          type: `SIGN_ME_UP_SUCCESS`,
          payload,
        })
      })
      .catch(payload => dispatch({
        type: `SIGN_ME_UP_FAILURE`,
        payload,
      }))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(SignMeUp)

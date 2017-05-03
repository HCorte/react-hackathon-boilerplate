import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form/immutable'

import LogInComponent from '../components/LogIn'
import { requests } from '../modules/logIn'


const LogIn = reduxForm({
  form: 'logIn', // a unique name for this form
})(LogInComponent)

const mapStateToProps = () => ({
})

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(requests, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(LogIn)

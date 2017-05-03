import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import LogInComponent from '../components/LogIn'
import { requests } from '../modules/logIn'

const mapStateToProps = () => ({
})

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(requests, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(LogInComponent)

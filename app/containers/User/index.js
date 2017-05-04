import { connect } from 'react-redux'
import CoreLayout from '../../layouts/CoreLayout'

const mapStateToProps = state => ({
  user: state.get('user'),
})

const mapDispatchToProps = {
  // FIXME: where to add ability to send commands and queries
}

export default connect(mapStateToProps, mapDispatchToProps)(CoreLayout)
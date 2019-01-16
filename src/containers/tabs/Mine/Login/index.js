import Login from './Login'
import { setUser } from '../../../../models/user'
import connect from 'react-redux/es/connect/connect'
const mapStateToProps = state => ({
  user: state.user.toJS(),
})

const mapDispatchToProps = {
  setUser,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login)

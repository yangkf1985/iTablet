/**
 * Created by imobile-xzy on 2019/3/4.
 */
import Friend from './Friend'
import Chat from './Chat/Chat'
import AddFriend from './AddFriend'
import { connect } from 'react-redux'
import { setUser } from '../../../models/user'

const mapStateToProps = state => ({
  user: state.user.toJS(),
})

const mapDispatchToProps = {
  setUser,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Friend)

export { Chat, AddFriend }
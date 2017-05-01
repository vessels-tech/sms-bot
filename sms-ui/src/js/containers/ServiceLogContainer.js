import { connect } from 'react-redux'
import ServiceLog from '../components/ServiceLog'

const mapStateToProps = (state) => {
  return {
    serviceLogs: state.serviceLogs
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     onTodoClick: (id) => {
//       dispatch(toggleTodo(id))
//     }
//   }
// }

const ServiceLogContainer = connect(
  mapStateToProps,
  // mapDispatchToProps
)(ServiceLog)

export default ServiceLogContainer

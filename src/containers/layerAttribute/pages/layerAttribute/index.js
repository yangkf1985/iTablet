import { connect } from 'react-redux'
import LayerAttribute from './LayerAttribute'
import { setCurrentAttribute } from '../../../../models/layers'

const mapStateToProps = state => ({
  currentAttribute: state.layers.toJS().currentAttribute,
  selection: state.layers.toJS().selection,
  currentLayer: state.layers.toJS().currentLayer,
})

const mapDispatchToProps = {
  setCurrentAttribute,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LayerAttribute)

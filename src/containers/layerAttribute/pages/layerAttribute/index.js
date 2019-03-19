import { connect } from 'react-redux'
import LayerAttribute from './LayerAttribute'
import {
  setCurrentAttribute,
  // getAttributes,
  // setAttributes,
  setLayerAttributes,
  setAttributeHistory,
} from '../../../../models/layers'

const mapStateToProps = state => ({
  currentAttribute: state.layers.toJS().currentAttribute,
  selection: state.layers.toJS().selection,
  currentLayer: state.layers.toJS().currentLayer,
  attributesHistory: state.layers.toJS().attributesHistory,
  attributes: state.layers.toJS().attributes,
  map: state.map.toJS(),
  nav: state.nav.toJS(),
})

const mapDispatchToProps = {
  setCurrentAttribute,
  // getAttributes,
  // setAttributes,
  setLayerAttributes,
  setAttributeHistory,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LayerAttribute)

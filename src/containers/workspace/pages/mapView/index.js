import { connect } from 'react-redux'
import MapView from './MapView'
import {
  setEditLayer,
  setSelection,
  setAnalystLayer,
  getLayers,
  setCurrentAttribute,
  getAttributes,
  setCurrentLayer,
} from '../../../../models/layers'
import {
  setLatestMap,
  setCurrentMap,
  getMaps,
  openWorkspace,
  closeWorkspace,
  exportWorkspace,
  openMap,
  closeMap,
} from '../../../../models/map'
import {
  importTemplate,
  importWorkspace,
  setCurrentTemplateInfo,
  setTemplate,
  getSymbolTemplates,
} from '../../../../models/template'
import { setBufferSetting, setOverlaySetting } from '../../../../models/setting'
import { setCollectionInfo } from '../../../../models/collection'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  editLayer: state.layers.toJS().editLayer,
  analystLayer: state.layers.toJS().analystLayer,
  selection: state.layers.toJS().selection,
  latestMap: state.map.toJS().latestMap,
  workspace: state.map.toJS().workspace,
  map: state.map.toJS(),
  mapControl: state.map.toJS().mapControl,
  bufferSetting: state.setting.toJS().buffer,
  overlaySetting: state.setting.toJS().overlay,
  symbol: state.symbol.toJS(),
  user: state.user.toJS(),
  currentLayer: state.layers.toJS().currentLayer,
  layers: state.layers.toJS(),
  collection: state.collection.toJS(),
  template: state.template.toJS(),
  device: state.device.toJS().device,
})

const mapDispatchToProps = {
  setEditLayer,
  setSelection,
  setLatestMap,
  setBufferSetting,
  setOverlaySetting,
  setAnalystLayer,
  setCurrentMap,
  getLayers,
  setCollectionInfo,
  setCurrentLayer,
  setCurrentAttribute,
  getAttributes,
  importTemplate,
  importWorkspace,
  setCurrentTemplateInfo,
  setTemplate,
  getMaps,
  exportWorkspace,
  openWorkspace,
  closeWorkspace,
  openMap,
  closeMap,
  getSymbolTemplates,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapView)

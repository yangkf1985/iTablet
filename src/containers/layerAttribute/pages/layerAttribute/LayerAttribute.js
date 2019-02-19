/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View, Text, Platform, BackHandler } from 'react-native'
import NavigationService from '../../../NavigationService'
import { Container } from '../../../../components'
import { Toast } from '../../../../utils'
import { ConstInfo, MAP_MODULE } from '../../../../constants'
import { MapToolbar } from '../../../workspace/components'
import constants from '../../../workspace/constants'
import { LayerAttributeTable } from '../../components'
import styles from './styles'
// import { SScene } from 'imobile_for_reactnative'
const SINGLE_ATTRIBUTE = 'singleAttribute'
export default class LayerAttribute extends React.Component {
  props: {
    nav: Object,
    navigation: Object,
    currentAttribute: Object,
    currentLayer: Object,
    selection: Object,
    attributes: Object,
    setAttributes: () => {},
    setCurrentAttribute: () => {},
    getAttributes: () => {},
    closeMap: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.type = params && params.type
    this.state = {
      attribute: {},
      showTable: false,
    }

    this.currentFieldInfo = []
    this.currentFieldIndex = -1
    this.currentPage = 0
    this.pageSize = 20
  }

  componentDidMount() {
    Platform.OS === 'android' &&
      BackHandler.addEventListener('hardwareBackPress', this.back)
    if (this.type === 'MAP_3D') {
      this.getMap3DAttribute()
    } else {
      this.setLoading(true, ConstInfo.LOADING_DATA)
      this.refresh()
    }
  }

  componentDidUpdate(prevProps) {
    let mapTabs = this.props.nav.routes[this.props.nav.index]
    if (
      JSON.stringify(prevProps.currentLayer) !==
        JSON.stringify(this.props.currentLayer) ||
      (mapTabs.routes &&
        mapTabs.routes[mapTabs.index].key === 'LayerAttribute' &&
        JSON.stringify(this.props.nav) !== JSON.stringify(prevProps.nav))
    ) {
      this.refresh()
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.back)
    }
    this.props.setCurrentAttribute({})
  }

  getMap3DAttribute = async (cb = () => {}) => {
    // let list = []
    // let data = await SScene.getLableAttributeList()
    // for (let index = 0; index < data.length; index++) {
    //   let arr = []
    //   Object.keys(data[index]).forEach(key => {
    //     let item = {
    //       fieldInfo: { caption: key },
    //       name: key,
    //       value: data[index][key],
    //     }
    //     if (key === 'id') {
    //       arr.unshift(item)
    //     } else {
    //       arr.push(item)
    //     }
    //   })
    //   list.push(arr)
    // }
    // this.props.setAttributes(list)
    !this.state.showTable &&
      this.setState({
        showTable: true,
      })
    cb && cb()
  }

  /** 下拉刷新 **/
  refresh = (cb = () => {}) => {
    this.currentPage = 0
    this.getAttribute(cb)
  }

  /** 加载更多 **/
  loadMore = (cb = () => {}) => {
    this.currentPage += 1
    this.getAttribute(attribute => {
      cb && cb()
      if (!attribute || attribute.length <= 0) {
        Toast.show(ConstInfo.ALL_DATA_ALREADY_LOADED)
        this.currentPage--
      }
    })
  }

  getAttribute = (cb = () => {}) => {
    if (!this.props.currentLayer.path) return
    let attribute = []
    ;(async function() {
      try {
        attribute = await this.props.getAttributes({
          path: this.props.currentLayer.path,
          page: this.currentPage,
          size: this.pageSize,
        })
        !this.state.showTable &&
          this.setState({
            showTable: true,
          })
        this.setLoading(false)
        cb && cb(attribute)
      } catch (e) {
        this.setLoading(false)
        cb && cb(attribute)
      }
    }.bind(this)())
  }

  add = () => {
    Toast.show('待做')
  }

  edit = () => {
    if (this.currentFieldInfo.length > 0) {
      let smID = -1
      for (let i = 0; i < this.currentFieldInfo.length; i++) {
        if (this.currentFieldInfo[i].name === 'SMID') {
          smID = this.currentFieldInfo[i].value
          break
        }
      }
      smID >= 0 &&
        NavigationService.navigate('LayerAttributeObj', {
          dataset: this.state.dataset,
          filter: 'SmID=' + smID,
          index: this.currentFieldIndex,
          callBack: this.getDatasets,
        })
    } else {
      Toast.show('请选择一个属性')
    }
  }

  selectRow = (data, index) => {
    if (!data || index < 0) return
    this.currentFieldInfo = data
    this.currentFieldIndex = index
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  setSaveViewVisible = visible => {
    GLOBAL.SaveMapView &&
      GLOBAL.SaveMapView.setVisible(visible, this.setLoading)
  }

  back = () => {
    if (this.type === 'MAP_3D') {
      this.props.navigation.navigate('Map3D')
    } else {
      this.props.navigation.navigate('MapView')
    }
    return true
  }

  renderToolBar = () => {
    return (
      <MapToolbar
        navigation={this.props.navigation}
        initIndex={2}
        type={this.type}
      />
    )
  }

  renderMapLayerAttribute = () => {
    if (
      !this.props.attributes ||
      (!this.props.attributes.data && this.props.attributes.data.length === 0)
    )
      return null
    return (
      <LayerAttributeTable
        ref={ref => (this.table = ref)}
        data={
          this.props.attributes.data.length > 1
            ? this.props.attributes.data
            : this.props.attributes.data[0]
        }
        tableHead={
          this.props.attributes.data.length > 1
            ? this.props.attributes.head
            : ['名称', '属性值']
        }
        widthArr={this.props.attributes.data.length === 1 && [100, 100]}
        type={
          this.props.attributes.data.length > 1
            ? LayerAttributeTable.Type.MULTI_DATA
            : LayerAttributeTable.Type.SINGLE_DATA
        }
        selectRow={this.selectRow}
        refresh={cb => this.refresh(cb)}
        loadMore={cb => this.loadMore(cb)}
      />
    )
  }

  render() {
    let title = ''
    switch (GLOBAL.Type) {
      case constants.COLLECTION:
        title = MAP_MODULE.MAP_COLLECTION
        break
      case constants.MAP_EDIT:
        title = MAP_MODULE.MAP_EDIT
        break
      case constants.MAP_3D:
        title = MAP_MODULE.MAP_3D
        break
      case constants.MAP_THEME:
        title = MAP_MODULE.MAP_THEME
        break
    }
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: title,
          navigation: this.props.navigation,
          // backAction: this.back,
          // backImg: require('../../../../assets/mapTools/icon_close.png'),
          withoutBack: true,
        }}
        bottomBar={this.type !== SINGLE_ATTRIBUTE && this.renderToolBar()}
        style={styles.container}
      >
        {this.state.showTable &&
        this.props.attributes &&
        this.props.attributes.head ? (
            this.props.attributes.head.length > 0 ? (
            // this.type === 'MAP_3D' ? (
            //   this.renderMap3dLayerAttribute()
            // ) : (
            //   this.renderMapLayerAttribute()
            // )
              this.renderMapLayerAttribute()
            ) : (
              <View style={styles.infoView}>
                <Text style={styles.info}>请选择图层对象</Text>
              </View>
            )
          ) : (
            <View style={styles.infoView}>
              <Text style={styles.info}>请选择图层</Text>
            </View>
          )}
      </Container>
    )
  }
}

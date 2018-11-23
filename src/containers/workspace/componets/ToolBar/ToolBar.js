import React from 'react'
import { scaleSize, screen, Toast } from '../../../../utils'
import { color, zIndexLevel } from '../../../../styles'
import { MTBtn, TableList } from '../../../../components'
import {
  ConstToolType,
  BotMap,
  layerAdd,
  Map3DBaseMapList,
} from '../../../../constants'
import Map3DToolBar from '../Map3DToolBar'
import NavigationService from '../../../../containers/NavigationService'
import { SMap, SAnalyst, SScene } from 'imobile_for_reactnative'
import ToolbarData from './ToolbarData'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SectionList,
  Animated,
} from 'react-native'
import {
  DatasetType,
  SCollector,
  GeoStyle,
  SMCollectorType,
} from 'imobile_for_reactnative'
import SymbolTabs from '../SymbolTabs'

/** 工具栏类型 **/
const list = 'list'
const table = 'table'
const tabs = 'tabs'
/** 地图按钮类型 **/
const cancel = 'cancel' // 取消
const flex = 'flex' // 伸缩
const style = 'style' // 样式
const commit = 'commit' // 提交
const placeholder = 'placeholder' // 占位
const closeAnalyst = 'closeAnalyst'
const clear = 'clear'
const endfly = 'endfly'
const back = 'back'
const save = 'save'
const clearsymbol = 'clearsymbol'
// 工具视图高度级别
// const HEIGHT = [scaleSize(100), scaleSize(200), scaleSize(600)]
// 工具表格默认高度
const DEFAULT_COLUMN = 4
// 是否全屏显示，是否有Overlay
const DEFAULT_FULL_SCREEN = true
// 地图按钮栏默认高度
const BUTTON_HEIGHT = scaleSize(80)

export default class ToolBar extends React.Component {
  props: {
    children: any,
    type?: string,
    containerProps?: Object,
    data: Array,
    existFullMap: () => {},
    symbol?: Object,
  }

  static defaultProps = {
    containerProps: {
      data: [],
      containerType: table,
      // height: HEIGHT[1],
      isFullScreen: DEFAULT_FULL_SCREEN,
      column: DEFAULT_COLUMN, // 只有table可以设置
    },
  }

  constructor(props) {
    super(props)
    this.height =
      props.containerProps.height >= 0
        ? props.containerProps.height
        : props.containerProps.containerType === list
          ? ConstToolType.HEIGHT[2]
          : ConstToolType.HEIGHT[1]
    this.originType = props.type // 初次传入的类型
    this.state = {
      // isShow: false,
      type: props.type, // 当前传入的类型
      containerType: props.containerProps.containerType,
      isFullScreen: props.containerProps.isFullScreen,
      // height: props.containerProps.height,
      column: props.containerProps.column,
      // data: this.getData(props.type),
      data: [],
      buttons: [],
      bottom: new Animated.Value(-screen.deviceHeight),
      boxHeight: new Animated.Value(this.height),
    }
    this.isShow = false
    this.isBoxShow = true
  }

  componentDidMount() {
    SScene.getAttribute()
    this.attributeListen()
  }

  componentWillUnmount() {
    this.listenevent && this.listenevent.remove()
  }

  /**建筑单体触控监听 */
  attributeListen() {
    this.listenevent = SScene.addListener({
      callback: result => {
        this.showMap3DAttribute(result)
      },
    })
  }

  getOriginType = () => {
    return this.originType
  }

  getType = () => {
    return this.type
  }

  getData = type => {
    let data, buttons, toolbarData
    // toolbarData = this.getCollectionData(type)
    toolbarData = ToolbarData.getTabBarData(type)
    data = toolbarData.data
    buttons = toolbarData.buttons
    if (data.length > 0) return { data, buttons }

    switch (type) {
      case ConstToolType.MAP_BASE:
        data = BotMap
        buttons = [cancel]
        break
      case ConstToolType.MAP3D_BASE:
        data = Map3DBaseMapList.baseListData
        buttons = [cancel]
        break
      case ConstToolType.MAP3D_ADD_LAYER:
        data = Map3DBaseMapList.layerListdata
        buttons = [cancel, commit]
        break
      case ConstToolType.MAP_ADD_LAYER:
        data = layerAdd
        buttons = [cancel, placeholder, commit]
        break
      case ConstToolType.MAP_SYMBOL:
        buttons = [cancel]
        break
      // 第一级采集选项
      case ConstToolType.MAP_COLLECTION_POINT:
      case ConstToolType.MAP_COLLECTION_LINE:
      case ConstToolType.MAP_COLLECTION_REGION: {
        let gpsPointType =
          type === ConstToolType.MAP_COLLECTION_POINT
            ? SMCollectorType.POINT_GPS
            : type === ConstToolType.MAP_COLLECTION_LINE
              ? SMCollectorType.LINE_GPS_POINT
              : SMCollectorType.REGION_GPS_POINT
        data.push({
          key: 'gpsPoint',
          title: 'GPS打点',
          action: () => this.showCollection(gpsPointType),
          size: 'large',
          image: require('../../../../assets/function/icon_function_base_map.png'),
        })
        if (type !== ConstToolType.MAP_COLLECTION_POINT) {
          let gpsPathType =
            type === ConstToolType.MAP_COLLECTION_LINE
              ? SMCollectorType.LINE_GPS_PATH
              : SMCollectorType.REGION_GPS_PATH
          data.push({
            key: 'gpsPath',
            title: 'GPS轨迹',
            action: () => this.showCollection(gpsPathType),
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          })
        }
        let pointDrawType =
          type === ConstToolType.MAP_COLLECTION_POINT
            ? SMCollectorType.POINT_HAND
            : type === ConstToolType.MAP_COLLECTION_LINE
              ? SMCollectorType.LINE_HAND_POINT
              : SMCollectorType.REGION_HAND_POINT
        data.push({
          key: 'pointDraw',
          title: '点绘式',
          action: () => this.showCollection(pointDrawType),
          size: 'large',
          image: require('../../../../assets/function/icon_function_base_map.png'),
        })
        if (type !== ConstToolType.MAP_COLLECTION_POINT) {
          let freeDrawType =
            type === ConstToolType.MAP_COLLECTION_LINE
              ? SMCollectorType.LINE_HAND_PATH
              : SMCollectorType.REGION_HAND_PATH
          data.push({
            key: 'freeDraw',
            title: '自由式',
            action: () => this.showCollection(freeDrawType),
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          })
        } else {
          data.push({
            key: 'takePhoto',
            title: '拍照',
            action: () => this.showCollection(type),
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          })
        }
        buttons = [cancel, flex, placeholder]
        break
      }
      case ConstToolType.MAP_EDIT_REGION:
        data = [
          {
            key: 'addPoint',
            title: '添加节点',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'editPoint',
            title: '编辑节点',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'pointDraw',
            title: '点绘式',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'freeDraw',
            title: '自由式',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'takePhoto',
            title: '拍照',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
        ]
        buttons = [cancel, flex]
        break
      case ConstToolType.MAP_EDIT_LINE:
        data = [
          {
            key: 'addPoint',
            title: '添加节点',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'editPoint',
            title: '编辑节点',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'pointDraw',
            title: '点绘式',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'freeDraw',
            title: '自由式',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'takePhoto',
            title: '拍照',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
        ]
        buttons = [cancel, flex]
        break
      case ConstToolType.MAP_EDIT_POINT:
        data = [
          {
            key: 'addPoint',
            title: '添加节点',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'editPoint',
            title: '编辑节点',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'pointDraw',
            title: '点绘式',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'freeDraw',
            title: '自由式',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'takePhoto',
            title: '拍照',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
        ]
        buttons = [cancel, flex]
        break
      case ConstToolType.MAP_TOOL:
        buttons = [cancel, flex]
        break
      case ConstToolType.MAP3D_SYMBOL:
        data = [
          {
            key: 'map3DPoint',
            title: '打点',
            action: () => {
              try {
                this.listenevent.remove()
                SScene.startDrawPoint()
                this.showMap3DTool(ConstToolType.MAP3D_SYMBOL_POINT)
              } catch (error) {
                Toast.show('打点失败')
              }
            },
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'map3DText',
            title: '文字',
            action: () => {
              // this.showMap3DTool(ConstToolType.MAP3D_SYMBOL_TEXT)
            },
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'map3DPiontLine',
            title: '点绘线',
            action: () => {
              // this.showMap3DTool(ConstToolType.MAP3D_SYMBOL_POINTLINE)
            },
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'map3DFreeLine',
            title: '自由线',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'map3DPointSurface',
            title: '点绘面',
            action: () => {
              // this.showMap3DTool(ConstToolType.MAP3D_SYMBOL_POINTSURFACE)
            },
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'map3DFreeSurface',
            title: '自由面',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'map3DtrajectoryOne',
            title: '普通模式轨迹',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'map3DtrajectoryTwo',
            title: '抓路模式轨迹',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'map3DtrajectoryThree',
            title: '等距模式轨迹',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'map3DtrajectoryFour',
            title: '等时模式轨迹',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'map3DtrajectoryFive',
            title: '智能模式轨迹',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
        ]
        buttons = [clearsymbol, flex]
        break
      case ConstToolType.MAP3D_TOOL:
        data = [
          {
            key: 'distanceMeasure',
            title: '距离量算',
            action: () => {
              this.showMap3DTool(ConstToolType.MAP3D_TOOL_DISTANCEMEASURE)
            },
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'suerfaceMeasure',
            title: '面积量算',
            action: () => {
              this.showMap3DTool(ConstToolType.MAP3D_TOOL_SUERFACEMEASURE)
            },
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'heightMeasure',
            title: '高度量算',
            action: () => {
              this.showMap3DTool(ConstToolType.MAP3D_TOOL_HEIGHTMEASURE)
            },
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'selection',
            title: '选择',
            action: () => {
              this.showMap3DTool(ConstToolType.MAP3D_TOOL_SELECTION)
            },
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'Boxtailor',
            title: 'Box裁剪',
            action: () => {
              this.showMap3DTool(ConstToolType.MAP3D_TOOL_BOXTAILOR)
            },
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'PStailor',
            title: '平面裁剪',
            action: () => {
              this.showMap3DTool(ConstToolType.MAP3D_TOOL_PSTAILOR)
            },
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'Crosstailor',
            title: 'Cross裁剪',
            action: () => {
              this.showMap3DTool(ConstToolType.MAP3D_TOOL_CROSSTAILOR)
            },
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'fly',
            title: '飞行轨迹',
            action: () => {
              // this.isShow=!this.isShow
              // this.setVisible(true, ConstToolType.MAP3D_TOOL_FLYLIST, {
              //   containerType: 'list',
              //   isFullScreen:true,
              this.showMap3DTool(ConstToolType.MAP3D_TOOL_FLYLIST)
              // })
              // this.getflylist()
            },
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'level',
            title: '拉平',
            action: () => {
              this.showMap3DTool(ConstToolType.MAP3D_TOOL_LEVEL)
            },
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
        ]
        buttons = [cancel, flex]
        break
    }
    return { data, buttons }
  }

  getflylist = async () => {
    try {
      let flydata = await SScene.getFlyRouteNames()
      let data = [{ title: '飞行轨迹列表', data: flydata }]
      let buttons = [cancel, flex]
      return { data, buttons }
    } catch (error) {
      Toast.show('当前场景无飞行轨迹')
    }
  }

  /** 创建采集 **/
  createCollector = type => {
    // 风格
    let geoStyle = new GeoStyle()
    // geoStyle.setPointColor(0, 255, 0)
    // //线颜色
    // geoStyle.setLineColor(0, 110, 220)
    // //面颜色
    // geoStyle.setFillForeColor(255, 0, 0)
    //
    // let style = await SCollector.getStyle()
    let mType
    switch (type) {
      case SMCollectorType.POINT_GPS:
      case SMCollectorType.POINT_HAND: {
        if (this.props.symbol.currentSymbol.type === 'marker') {
          geoStyle.setMarkerStyle(this.props.symbol.currentSymbol.id)
        }
        mType = DatasetType.POINT
        break
      }
      case SMCollectorType.LINE_GPS_POINT:
      case SMCollectorType.LINE_GPS_PATH:
      case SMCollectorType.LINE_HAND_POINT:
      case SMCollectorType.LINE_HAND_PATH: {
        if (this.props.symbol.currentSymbol.type === 'line') {
          geoStyle.setLineStyle(this.props.symbol.currentSymbol.id)
        }
        mType = DatasetType.LINE
        break
      }
      case SMCollectorType.REGION_GPS_POINT:
      case SMCollectorType.REGION_GPS_PATH:
      case SMCollectorType.REGION_HAND_POINT:
      case SMCollectorType.REGION_HAND_PATH: {
        if (this.props.symbol.currentSymbol.type === 'fill') {
          geoStyle.setFillStyle(this.props.symbol.currentSymbol.id)
        }
        mType = DatasetType.REGION
        break
      }
    }
    //设置绘制风格
    SCollector.setStyle(geoStyle)

    let datasetName = this.props.symbol.currentSymbol.type
      ? this.props.symbol.currentSymbol.type +
        '_' +
        this.props.symbol.currentSymbol.id
      : ''
    SCollector.setDataset({
      datasetName,
      datasetType: mType,
      style: geoStyle,
    }).then(result => {
      result && SCollector.startCollect(type)
    })
  }

  /** 采集分类点击事件 **/
  showCollection = type => {
    let { data, buttons } = this.getData(type)
    this.setState(
      {
        type: type,
        data: data,
        buttons: buttons,
        // height: ConstToolType.HEIGHT[0],
        column: data.length,
      },
      () => {
        this.height = ConstToolType.HEIGHT[0]
        this.createCollector(type)
        this.showToolbar()
      },
    )
  }

  /** 三维单体触控属性事件 */

  showMap3DAttribute = async data => {
    let list = []
    Object.keys(data).forEach(key => {
      list.push({
        name: key,
        value: data[key],
      })
    })
    JSON.stringify(data) !== '{}' &&
      this.setState(
        {
          type: ConstToolType.MAP3D_ATTRIBUTE,
          data: list,
          buttons: [],
          // height: ConstToolType.HEIGHT[0],
          // column: data.length,
          containerType: 'list',
        },
        () => {
          // this.createCollector(type)
          this.height = ConstToolType.HEIGHT[1]
          this.showToolbar()
        },
      )
  }

  /** 三维分类点击事件*/
  showMap3DTool = async type => {
    if (type === ConstToolType.MAP3D_TOOL_FLYLIST) {
      let { data, buttons } = await this.getflylist()
      this.setState(
        {
          type: type,
          data: data,
          buttons: buttons,
          // height: ConstToolType.HEIGHT[0],
          // column: data.length,
          containerType: 'list',
        },
        () => {
          // this.createCollector(type)
          this.height = ConstToolType.HEIGHT[1]
          this.showToolbar()
        },
      )
    } else {
      let { data, buttons } = this.getData(type)
      this.setState(
        {
          type: type,
          data: data,
          buttons: buttons,
          // height: ConstToolType.HEIGHT[0],
          column: data.length,
          containerType: 'table',
        },
        () => {
          // this.createCollector(type)
          switch (type) {
            case ConstToolType.MAP3D_TOOL_DISTANCEMEASURE:
              this.height = ConstToolType.HEIGHT[0]
              this.showToolbar()
              break
            case ConstToolType.MAP3D_TOOL_SUERFACEMEASURE:
              this.height = ConstToolType.HEIGHT[0]
              this.showToolbar()
              break
            case ConstToolType.MAP3D_TOOL_FLY:
              this.height = ConstToolType.HEIGHT[0]
              this.showToolbar()
              break
            default:
              this.height = 0
              this.showToolbar()
              break
          }
        },
      )
    }
  }

  /** 拍照 **/
  takePhoto = () => {}

  /**
   * 设置是否显示
   * isShow: 是否显示
   * type:   显示数据类型
   * params: {
   *   isFullScreen:    是否全屏，
   *   height:          工具栏高度
   *   column:          表格列数（仅table可用）
   *   containerType:   容器的类型, list | table
   * }
   **/
  setVisible = (isShow, type = this.state.type, params = {}) => {
    if (this.isShow === isShow && type === this.state.type) return
    if (
      this.state.type !== type ||
      params.isFullScreen !== this.state.isFullScreen ||
      params.height !== this.height ||
      params.column !== this.state.column
    ) {
      let { data, buttons } = this.getData(type)
      this.originType = type
      this.height =
        params && typeof params.height === 'number'
          ? params.height
          : ConstToolType.HEIGHT[1]
      this.setState(
        {
          type: type,
          data: data,
          buttons: buttons,
          isFullScreen:
            params && params.isFullScreen !== undefined
              ? params.isFullScreen
              : DEFAULT_FULL_SCREEN,
          column:
            params && typeof params.column === 'number'
              ? params.column
              : DEFAULT_COLUMN,
          containerType:
            params && params.containerType
              ? params.containerType
              : type === ConstToolType.MAP_SYMBOL
                ? tabs
                : table,
        },
        () => {
          this.showToolbar(isShow)
          this.listenevent && SScene.clearSelection()
          !isShow && this.props.existFullMap && this.props.existFullMap()
        },
      )
    } else {
      this.showToolbar(isShow)
      !isShow && this.props.existFullMap && this.props.existFullMap()
    }
    this.isBoxShow = true
  }

  showToolbar = isShow => {
    // Toolbar的显示和隐藏
    if (this.isShow !== isShow) {
      isShow = isShow === undefined ? true : isShow
      Animated.timing(this.state.bottom, {
        toValue: isShow ? 0 : -screen.deviceHeight,
        duration: 300,
      }).start()
      this.isShow = isShow
    }
    // Box内容框的显示和隐藏
    if (JSON.stringify(this.state.boxHeight) !== this.height.toString()) {
      Animated.timing(this.state.boxHeight, {
        toValue: this.height,
        duration: 300,
      }).start()
    }
  }

  close = (type = this.originType) => {
    // 关闭采集
    if (type.indexOf('MAP_COLLECTION_') >= 0) {
      SCollector.stopCollect()
    }

    this.showToolbar(false)
    this.props.existFullMap && this.props.existFullMap()
  }

  clearsymbol = () => {
    this.attributeListen()
    SScene.clearAllLabel()
    this.showToolbar(false)
    this.props.existFullMap && this.props.existFullMap()
  }

  symbolsave = () => {
    try {
      SScene.save()
      Toast.show('保存成功')
    } catch (error) {
      Toast.show('保存失败')
    }
  }

  symbolback = () => {
    SScene.back()
  }

  commit = () => {
    this.showToolbar(false)
    this.props.existFullMap && this.props.existFullMap()
  }

  showBox = () => {
    Animated.timing(this.state.boxHeight, {
      toValue: this.isBoxShow ? 0 : this.height,
      duration: 300,
    }).start()
    this.isBoxShow = !this.isBoxShow
  }

  closeAnalyst = () => {
    // console.log(this.addlistener)
    // this.addlistener&&this.addlistener.remove()
    this.MeasureListener && this.MeasureListener.remove()
    SAnalyst.closeAnalysis()
    this.showToolbar(false)
    this.props.existFullMap && this.props.existFullMap()
  }

  clear = () => {
    switch (this.state.type) {
      case ConstToolType.MAP3D_TOOL_SUERFACEMEASURE:
        SAnalyst.clearSquareAnalyst()
        break
      case ConstToolType.MAP3D_TOOL_DISTANCEMEASURE:
        SAnalyst.clearLineAnalyst()
        break
      default:
        SAnalyst.clear()
        break
    }
  }

  endfly = () => {
    SScene.flyStop()
  }

  setfly = index => {
    SScene.setPosition(index)
    this.showMap3DTool(ConstToolType.MAP3D_TOOL_FLY)
  }
  renderListItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.listAction({ item, index })
        }}
      >
        <Text style={styles.item}>{item.title}</Text>
      </TouchableOpacity>
    )
  }

  renderListSectionHeader = ({ section }) => {
    return <Text style={styles.sectionHeader}>{section.title}</Text>
  }

  listAction = ({ item, index }) => {
    if (this.state.type === 'MAP3D_BASE') return
    if (item.action) {
      item.action && item.action()
    } else if (this.state.type === ConstToolType.MAP_ADD_LAYER) {
      NavigationService.navigate('WorkspaceFlieList', {
        cb: async path => {
          this.path = path
          let list = await SMap.getUDBName(path)
          let datalist = [
            {
              title: '数据集',
              data: list,
            },
          ]
          this.setState({ data: datalist, type: ConstToolType.MAP_ADD_DATASET })
        },
      })
    } else if (this.state.type === ConstToolType.MAP_ADD_DATASET) {
      (async function() {
        let udbpath = {
          server: this.path,
          alias: item.title,
        }
        await SMap.openUDBDatasource(udbpath, index)
      }.bind(this)())
    }
  }
  renderList = () => {
    if (this.state.data.length === 0) return
    return (
      <SectionList
        sections={this.state.data}
        renderItem={this.renderListItem}
        renderSectionHeader={this.renderListSectionHeader}
        keyExtractor={(item, index) => index}
      />
    )
  }

  renderTable = () => {
    return (
      <TableList
        data={this.state.data}
        numColumns={this.state.column}
        renderCell={this._renderItem}
      />
    )
  }

  itemaction = async item => {
    switch (item.key) {
      case 'psDistance':
        item.action({
          callback: (result, listener) => {
            Toast.show(result + '米')
            this.MeasureListener = listener
          },
        })
        break
      case 'spaceSuerface':
        item.action({
          callback: (result, listener) => {
            Toast.show(result + '平方米')
            this.MeasureListener = listener
          },
        })
        break
      default:
        item.action()
        break
    }
  }

  renderTabs = () => {
    return <SymbolTabs style={styles.tabsView} showToolbar={this.setVisible} />
  }

  _renderItem = ({ item, rowIndex, cellIndex }) => {
    return (
      <MTBtn
        style={[styles.cell, { width: screen.deviceWidth / this.state.column }]}
        key={rowIndex + '-' + cellIndex}
        title={item.title}
        textColor={'white'}
        size={MTBtn.Size.NORMAL}
        image={item.image}
        onPress={() => {
          this.itemaction(item)
        }}
      />
    )
  }

  renderMap3DList = () => {
    return (
      <Map3DToolBar
        data={this.state.data}
        type={this.state.type}
        setfly={this.setfly}
      />
    )
  }

  renderView = () => {
    let box
    switch (this.state.containerType) {
      case list:
        switch (this.state.type) {
          case 'MAP3D_BASE':
            box = this.renderMap3DList()
            break
          case 'MAP3D_TOOL_FLYLIST':
            box = this.renderMap3DList()
            break
          case 'MAP3D_ATTRIBUTE':
            box = this.renderMap3DList()
            break
          default:
            box = this.renderList()
            break
        }
        break
      case tabs:
        box = this.renderTabs()
        break
      case table:
      default:
        box = this.renderTable()
    }
    return (
      <Animated.View style={{ height: this.state.boxHeight }}>
        {box}
      </Animated.View>
    )
  }

  renderBottomBtn = (item, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => item.action(item)}
        style={styles.button}
      >
        <Image style={styles.img} resizeMode={'contain'} source={item.image} />
      </TouchableOpacity>
    )
  }

  renderBottomBtns = () => {
    let btns = []
    this.state.buttons.forEach((type, index) => {
      switch (type) {
        case cancel:
          btns.push(
            this.renderBottomBtn(
              {
                image: require('../../../../assets/mapEdit/cancel.png'),
                action: () => this.close(),
              },
              index,
            ),
          )
          break
        case flex:
          btns.push(
            this.renderBottomBtn(
              {
                image: require('../../../../assets/mapEdit/cancel.png'),
                action: this.showBox,
              },
              index,
            ),
          )
          break
        case style:
          btns.push(
            this.renderBottomBtn(
              {
                image: require('../../../../assets/mapEdit/cancel.png'),
                action: this.showBox,
              },
              index,
            ),
          )
          break
        case commit:
          btns.push(
            this.renderBottomBtn(
              {
                image: require('../../../../assets/mapEdit/commit.png'),
                action: this.commit,
              },
              index,
            ),
          )
          break
        case closeAnalyst:
          {
            btns.push(
              this.renderBottomBtn(
                {
                  image: require('../../../../assets/mapEdit/cancel.png'),
                  action: this.closeAnalyst,
                },
                index,
              ),
            )
          }
          break
        case clear:
          {
            btns.push(
              this.renderBottomBtn(
                {
                  image: require('../../../../assets/mapEdit/cancel.png'),
                  action: this.clear,
                },
                index,
              ),
            )
          }
          break
        case endfly:
          {
            btns.push(
              this.renderBottomBtn(
                {
                  image: require('../../../../assets/mapEdit/cancel.png'),
                  action: this.endfly,
                },
                index,
              ),
            )
          }
          break
        case placeholder:
          btns.push(<View style={{ flex: 1 }} key={type + '-' + index} />)
          break
        case back:
          btns.push(
            this.renderBottomBtn(
              {
                image: require('../../../../assets/mapEdit/commit.png'),
                action: this.symbolback,
              },
              index,
            ),
          )
          break
        case save:
          btns.push(
            this.renderBottomBtn(
              {
                image: require('../../../../assets/mapEdit/commit.png'),
                action: this.symbolsave,
              },
              index,
            ),
          )
          break
        case clearsymbol:
          btns.push(
            this.renderBottomBtn(
              {
                image: require('../../../../assets/mapEdit/commit.png'),
                action: this.clearsymbol,
              },
              index,
            ),
          )
          break
      }
    })
    return <View style={styles.buttonz}>{btns}</View>
  }

  render() {
    let containerStyle = this.state.isFullScreen
      ? styles.fullContainer
      : styles.wrapContainer
    return (
      <Animated.View style={[containerStyle, { bottom: this.state.bottom }]}>
        {this.state.isFullScreen && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.setVisible(false)}
            style={styles.overlay}
          />
        )}
        <View style={styles.containers}>
          {this.renderView()}
          {this.renderBottomBtns()}
        </View>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  fullContainer: {
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    right: 0,
    height: screen.deviceHeight,
    backgroundColor: '#rgba(0, 0, 0, 0)',
    zIndex: zIndexLevel.FOUR,
  },
  wrapContainer: {
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#rgba(0, 0, 0, 0)',
    zIndex: zIndexLevel.FOUR,
  },
  overlay: {
    flex: 1,
    backgroundColor: '#rgba(0, 0, 0, 0)',
    // zIndex: zIndexLevel.FOUR,
  },
  containers: {
    flexDirection: 'column',
    width: '100%',
    maxHeight: ConstToolType.HEIGHT[2] + BUTTON_HEIGHT,
    minHeight: BUTTON_HEIGHT,
    backgroundColor: color.theme,
    // zIndex: zIndexLevel.FOUR,
  },
  buttonz: {
    flexDirection: 'row',
    height: BUTTON_HEIGHT,
    paddingHorizontal: scaleSize(20),
    backgroundColor: color.theme,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    height: scaleSize(60),
    // width: scaleSize(60),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.theme,
  },
  img: {
    height: scaleSize(40),
    width: scaleSize(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    fontSize: 23,
    fontWeight: 'bold',
    backgroundColor: color.theme,
    color: 'white',
  },
  item: {
    padding: 10,
    fontSize: 18,
    paddingLeft: 20,
    height: 44,
    backgroundColor: color.theme,
    color: 'white',
  },
  cell: {
    // flex: 1,
  },
  tabsView: {
    height: ConstToolType.HEIGHT[2] - BUTTON_HEIGHT,
  },
})

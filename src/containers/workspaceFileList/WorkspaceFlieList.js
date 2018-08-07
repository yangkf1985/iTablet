import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  View,
} from 'react-native'
import { Container, EmptyView } from '../../components'
import { OpenMapfile, WorkspaceConnectionInfo, EngineType, Action, Point2D, Utility } from 'imobile_for_javascript'
import { Toast, scaleSize } from '../../utils'
import { ConstPath } from '../../constains'
import NavigationService from '../NavigationService'
import { color } from '../../styles'

export default class WorkSpaceFileList extends Component {

  props: {
    title: string,
    navigation: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    const { nav } = this.props
    this.workspace = params.workspace ? params.workspace : 'noworkspace'
    this.map = params.map ? params.map : 'nomap'
    this.mapControl = params.mapControl ? params.mapControl : 'nomapControl'
    this.routes = nav.routes
    this.path = ConstPath.SampleDataPath
    this.title = params.title
    this.need = params.need
    this.state = {
      data: [],
      backPath: '',
      showData: false,
    }
  }

  componentDidMount() {
    (async function () {
      try {
        this.container.setLoading(true)
        let exist = await Utility.fileIsExistInHomeDirectory(ConstPath.SampleDataPath)
        if (!exist) {
          this.setState({
            showData: true,
          }, () => {
            this.container.setLoading(false)
          })
        } else {
          this.getFileList({path: this.path})
        }
      } catch (e) {
        console.error(e)
      }
    }).bind(this)()
  }



  _offLine_More = () => {
    Toast.show('无法打开此类型文件')
  }


  getFileList = item => {
    (async function () {
      try {
        let OpenMapfileModule = new OpenMapfile()
        let isDirectory = await OpenMapfileModule.isdirectory(item.path)
        if (!isDirectory) {
          let filename = item.path.substr(item.path.lastIndexOf('.')).toLowerCase()
          if (filename === '.smwu' && this.need === 'workspace') {
            this._toLoadMapView(item.path, '')
          } else if (filename === '.udb' && this.need === 'udb') {
            this._toLoadMapView(item.path, 'UDB')
          } else {
            this._offLine_More()
          }
        } else {
          let fileList = await OpenMapfileModule.getfilelist(item.path)
          this.setState({
            data: fileList,
            backPath: item.path,
            showData: true,
          })
          this.container.setLoading(false)
        }
      } catch (e) {
        console.error(e)
        this.container.setLoading(true)
      }
    }).bind(this)()
  }

  _toLoadMapView = (path, type) => {
    (async function () {
      if (this.workspace !== 'noworkspace' && this.need === 'workspace') {
        let key = ''
        for (let index = 0; index < this.routes.length; index++) {
          if (this.routes[index].routeName === 'MapView') {
            key = this.routes[index + 1].key
          }
        }
        await this.map.close()
        await this.workspace.closeAllDatasource()
        let WorkspaceConnectionInfoModule = new WorkspaceConnectionInfo()
        let workspaceCOnnectionInfo = await WorkspaceConnectionInfoModule.createJSObj()
        let openpath = '/sdcard' + path
        await workspaceCOnnectionInfo.setServer(openpath)
        await workspaceCOnnectionInfo.setType(9)
        await this.workspace.open(workspaceCOnnectionInfo)
        await this.map.setWorkspace(this.workspace)
        this.mapName = await this.workspace.getMapName(0)
        await this.map.open(this.mapName)
        await this.mapControl.setAction(Action.SELECT)
        await this.map.refresh()
        NavigationService.goBack(key)
      }
      if (this.workspace !== 'noworkspace' && this.need === 'udb') {
        // let str = path.substr(path.lastIndexOf('/') + 1)
        // let name = str.substr(0, str.lastIndexOf('.'))
        await this.map.close()
        await this.workspace.closeAllDatasource()
        // let datasources = await this.workspace.getDatasources()
        // let count = await datasources.getCount()
        // for (let index = 0; index < count; index++) {
        //   datasourcename = await (await datasources.get(index)).getAlias()
        //   if (name === datasourcename) {
        //     Toast.show('空间中此数据源已被打开')
        //     return
        //   }
        // }
        let key = ''
        for (let index = 0; index < this.routes.length; index++) {
          if (this.routes[index].routeName === 'MapView') {
            key = this.routes[index + 1].key
          }
        }
        // this.DSParams = { server: path, engineType: EngineType.UDB }
        // await this.workspace.openDatasource(this.DSParams)
        // await this.mapControl.setAction(Action.SELECT)
        // await this.map.refresh()
        // NavigationService.goBack(key)

        const point2dModule = new Point2D()

        // await this.map.setScale(0.0001)
        navigator.geolocation.getCurrentPosition(
          position => {
            let lat = position.coords.latitude
            let lon = position.coords.longitude
            ;(async () => {
              let centerPoint = await point2dModule.createObj(lon, lat)
              await this.map.setCenter(centerPoint)
              await this.mapControl.setAction(Action.PAN)
              await this.map.refresh()
              key && NavigationService.goBack(key)
            }).bind(this)()
          }
        )
        this.DSParams = { server: path, engineType: EngineType.UDB }
        let layerIndex = 0

        let dsBaseMap = await this.workspace.openDatasource(this.DSParams)

        let dataset = await dsBaseMap.getDataset(layerIndex)
        await this.map.addLayer(dataset, true)
      }
      else {
        NavigationService.navigate('MapView', { path: path, type: type })
      }
    }).bind(this)()
  }


  _refresh = async item => {
    await this.getFileList(item)
  }

  _toBack = async () => {
    if (this.state.backPath === ConstPath.SampleDataPath) {
      return
    } else {
      let backPath = this.state.backPath.substr(0, this.state.backPath.lastIndexOf("/", this.state.backPath.lastIndexOf('/')))
      this.setState({ backPath: backPath })
      await this.getFileList({path: backPath})
    }
  }

  headerBack = () => {
    if (this.state.backPath === '' || this.state.backPath === ConstPath.SampleDataPath || this.state.backPath === ConstPath.SampleDataPath) {
      return null
    }
    else {
      return (
        <TouchableOpacity style={styles.headerBack} onPress={() => this._toBack()}>
          <Text style={styles.back}>返回上一层目录</Text>
          <Text style={styles.back}>{this.state.backPath}</Text>
        </TouchableOpacity>
      )
    }
  }

  renderItem = ({ item }) => {
    let image = item.isDirectory ? require('../../assets/public/icon-files.png') : require('../../assets/public/icon-file.png')
    return (
      <TouchableOpacity onPress={() => this._refresh(item)} style={styles.row}>
        <View style={styles.imgView}>
          <Image source={image} style={styles.img} />
        </View>
        <Text numberOfLines={1} style={styles.item}>{item.name}</Text>
      </TouchableOpacity>
    )
  }

  itemSeparator = () => {
    return (<View style={styles.itemSeparator} />)
  }

  _keyExtractor = item => {
    return item.path
  }

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => this.container = ref}
        initWithLoading
        headerProps={{
          title: this.title,
          navigation: this.props.navigation,
        }}>
        {this.headerBack()}
        {
          this.state.showData && (
            this.state.data.length > 0
              ? <FlatList
                ItemSeparatorComponent={this.itemSeparator}
                style={styles.container}
                // ListHeaderComponent={this.headerBack}
                data={this.state.data}
                renderItem={this.renderItem}
                keyExtractor={this._keyExtractor}
              />
              : <EmptyView />)
        }
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.background2,
  },
  item: {
    marginLeft: scaleSize(30),
    fontSize: 20,
  },
  back: {
    fontSize: 20,
    color: '#1296db',
    paddingTop: scaleSize(30),
    paddingBottom: scaleSize(30),
    height: scaleSize(100),
  },
  row: {
    flex: 1,
    height: scaleSize(80),
    flexDirection: 'row',
    borderColor: color.background3,
    borderWidth: scaleSize(2),
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: scaleSize(30),
  },
  imgView: {
    width: scaleSize(80),
    height: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: scaleSize(60),
    height: scaleSize(60),
  },
  itemSeparator: {
    height: scaleSize(6),
  },
  headerBack: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(30),
  },
})
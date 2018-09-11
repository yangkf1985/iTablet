import React, { Component } from 'react'
import { View } from 'react-native'

import { BtnbarLoad, ExampleMapList, OffLineList } from './components'
import { UsualTitle, Container } from '../../components'
import { ConstOnline } from '../../constains'
import { Toast } from '../../utils'
import NavigationService from '../NavigationService'
import { Point2D ,Action} from 'imobile_for_javascript'
import styles from './styles'

export default class MapLoad extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    const { nav } = this.props
    this.workspace = params.workspace
    this.map = params.map
    this.routes = nav.routes
    this.mapControl = params.mapControl
    this.fileexist=params.fileexist
  }

  TD = async () => {
      this.map && await this.map.close()
      this.workspace && this.workspace.closeAllDatasource()
      const point2dModule = new Point2D()
      navigator.geolocation.getCurrentPosition(
        position => {
          let lat = position.coords.latitude
          let lon = position.coords.longitude
          ;(async () => {
            let centerPoint = await point2dModule.createObj(lon, lat)
            await this.map.setCenter(centerPoint)
            await this.map.viewEntire()
            await this.mapControl.setAction(Action.PAN)
            await this.map.refresh()
            NavigationService.goBack()
          }).bind(this)()
        }
      )
      let layerIndex = 0
      let dsBaseMap = await this.workspace.openDatasource(ConstOnline.TD.DSParams)
      let dataset = await dsBaseMap.getDataset(layerIndex)
      await this.map.addLayer(dataset, true)
    }
  Baidu = () => {
    this.cb && this.cb()
    NavigationService.navigate('MapView', ConstOnline.Baidu)

  }
  OSM = () => {
    this.cb && this.cb()
    NavigationService.navigate('MapView', ConstOnline.OSM)

  }
  Google = () => {
    this.cb && this.cb()
    NavigationService.navigate('MapView', ConstOnline.Google)

  }
  render() {
    return (
      <Container
        ref={ref => this.container = ref}
        style={styles.container}
        headerProps={{
          title: '打开数据',
          navigation: this.props.navigation,
          headerRight: [
          ],
        }}>
        <View style={styles.linlist}>
          <UsualTitle title='本地地图' />
          <OffLineList Workspace={this.workspace} map={this.map} mapControl={this.mapControl} />
        </View>
        <View style={styles.btnTabContainer}>
          <UsualTitle title='在线地图' />
          <BtnbarLoad
            TD={this.TD}
            Baidu={this.Baidu}
            OSM={this.OSM}
            Google={this.Google} />
        </View>
        <View style={styles.examplemaplist}>
          <UsualTitle title='示例地图' style={styles.examplemaplist} />
          <ExampleMapList />
        </View>
      </Container>
    )
  }
}

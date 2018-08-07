import React, { Component } from 'react'
import { View} from 'react-native'

import { BtnbarLoad, ExampleMapList, OffLineList } from './components'
import { UsualTitle, Container } from '../../components'
import { ConstOnline } from '../../constains'
import { Toast } from '../../utils'
import NavigationService from '../NavigationService'

import styles from './styles'

export default class MapLoad extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.workspace = params.workspace ? params.workspace : 'noworkspace'
    this.map = params.map ? params.map : 'nomap'
    this.mapControl = params.mapControl ? params.mapControl : 'nomapControl'
  }

  render() {
    return (
      <Container
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
            TD={() => { this.workspace==='noworkspace' ? NavigationService.navigate('MapView', ConstOnline.TD): Toast.show('请关闭当前空间后再打开在线地图')}}
            Baidu={() => { NavigationService.navigate('MapView', ConstOnline.Baidu) }}
            OSM={() => { NavigationService.navigate('MapView', ConstOnline.OSM) }}
            Google={() => { NavigationService.navigate('MapView', ConstOnline.Google) }}
          />
        </View>
        <View style={styles.examplemaplist}>
          <UsualTitle title='示例地图' style={styles.examplemaplist} />
          <ExampleMapList />
        </View>
      </Container>
    )
  }
}
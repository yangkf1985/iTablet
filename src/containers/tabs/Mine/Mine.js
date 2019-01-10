/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/
import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import { Container } from '../../../components'
import { FileTools } from '../../../native'
import NavigationService from '../../NavigationService'
import Login from './Login'
import { color } from './styles'
import ConstPath from '../../../constants/ConstPath'
import { SOnlineService } from 'imobile_for_reactnative'
import Toast from '../../../utils/Toast'

export default class Mine extends Component {
  props: {
    navigation: Object,
    user: Object,
    setUser: () => {},
    closeWorkspace: () => {},
    openWorkspace: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      display: 'flex',
    }
    this.goToMyService = this.goToMyService.bind(this)
    this.goToMyOnlineData = this.goToMyOnlineData.bind(this)
    this.goToMyLocalData = this.goToMyLocalData.bind(this)
  }
  componentDidUpdate(previousProps) {
    if (
      this.props.user.currentUser.userName !== undefined &&
      this.props.user.currentUser.userName !== '' &&
      this.props.user.currentUser.userName !==
        previousProps.user.currentUser.userName
    ) {
      this.openUserWorkspace()
      SOnlineService.syncAndroidCookie()
    }
  }
  openUserWorkspace = () => {
    this.props.closeWorkspace(async () => {
      let userPath = await FileTools.appendingHomeDirectory(
        ConstPath.UserPath +
          this.props.user.currentUser.userName +
          '/' +
          ConstPath.RelativeFilePath.Workspace,
      )
      this.props.openWorkspace({ server: userPath })
    })
  }

  goToPersonal = () => {
    NavigationService.navigate('Personal')
  }

  goToMyLocalData = () => {
    // this.setState({display:'none'})
    NavigationService.navigate('MyLocalData', {
      userName: this.props.user.currentUser.userName,
    })
  }
  goToMyOnlineData = async () => {
    NavigationService.navigate('MyOnlineData')
  }

  goToMyService = () => {
    NavigationService.navigate('MyService')
  }

  _selectionRender = () => {
    if (this.props.user.currentUser.userName === 'Customer') {
      let fontSize = 16
      return (
        <View opacity={1} style={{ flex: 1, backgroundColor: color.content }}>
          {this._renderHeader(fontSize)}
          {this._renderLine()}
          {this._renderItem({
            title: '本地数据',
            leftImagePath: require('../../../assets/Mine/个人主页-我的底图.png'),
            onClick: this.goToMyLocalData,
          })}
        </View>
      )
    } else {
      return this._render()
    }
  }

  _render = () => {
    let fontSize = 16
    return (
      <View opacity={1} style={{ flex: 1, backgroundColor: color.content }}>
        {this._renderHeader(fontSize)}
        <ScrollView
          style={{ flex: 1 }}
          // contentContainerStyle={{ alignItems:'center' }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          overScrollMode={'always'}
          bounces={true}
        >
          {this._renderLine()}
          {this._renderItem({
            title: '本地数据',
            leftImagePath: require('../../../assets/Mine/个人主页-我的底图.png'),
            onClick: this.goToMyLocalData,
          })}
          {this._renderItem({
            title: '我的数据',
            leftImagePath: require('../../../assets/Mine/个人主页-我的数据.png'),
            onClick: this.goToMyOnlineData,
          })}
          {this._renderItem({
            title: '我的服务',
            leftImagePath: require('../../../assets/Mine/个人主页-我的服务.png'),
            onClick: this.goToMyService,
          })}
        </ScrollView>
      </View>
    )
  }
  _renderHeader = fontSize => {
    let headerHeight = 80
    let imageWidth = 40
    // let headerImage = require('../../../assets/public/icon-avatar-default.png')
    let headerImage =
      'https://cdn3.supermapol.com/web/cloud/84d9fac0/static/images/myaccount/icon_plane.png'
    return (
      <View
        style={{
          flexDirection: 'row',
          height: headerHeight,
          width: '100%',
        }}
      >
        <TouchableOpacity
          onPress={this.goToPersonal}
          activeOpacity={1}
          style={{
            width: headerHeight,
            height: headerHeight,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            resizeMode={'contain'}
            style={{
              width: imageWidth,
              height: imageWidth,
              borderRadius: 8,
            }}
            source={{ uri: headerImage }}
          />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            lineHeight: headerHeight,
            fontSize: fontSize,
            color: 'white',
          }}
        >
          {this.props.user.currentUser.userName}
        </Text>
      </View>
    )
  }
  _renderLine = () => {
    return (
      <View
        style={{ width: '100%', height: 8, backgroundColor: color.theme }}
      />
    )
  }
  _renderItem = (
    itemRequire = {
      title: '',
      leftImagePath: '',
      onClick: () => {
        Toast.show('test')
      },
    },
    itemOptions = {
      itemWidth: '100%',
      itemHeight: 50,
      fontSize: 16,
      imageWidth: 25,
      imageHeight: 25,
      rightImagePath: require('../../../assets/Mine/个人主页-箭头.png'),
    },
  ) => {
    const { title, leftImagePath, onClick } = itemRequire
    const {
      itemWidth,
      itemHeight,
      fontSize,
      imageWidth,
      imageHeight,
      rightImagePath,
    } = itemOptions

    return (
      <View display={this.state.display}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            width: itemWidth,
            height: itemHeight,
            alignItems: 'center',
            paddingLeft: 10,
            paddingRight: 10,
          }}
          onPress={onClick}
        >
          <Image
            style={{ width: imageWidth, height: imageHeight }}
            resizeMode={'contain'}
            source={leftImagePath}
          />
          <Text
            style={{
              lineHeight: itemHeight,
              flex: 1,
              textAlign: 'left',
              fontSize: fontSize,
              color: 'white',
              paddingLeft: 5,
            }}
          >
            {title}
          </Text>
          <Image
            style={{ width: imageWidth, height: imageHeight }}
            resizeMode={'contain'}
            source={rightImagePath}
          />
        </TouchableOpacity>
        <View
          style={{ width: itemWidth, height: 1, backgroundColor: color.theme }}
        />
      </View>
    )
  }

  render() {
    if (
      this.props.user &&
      this.props.user.currentUser &&
      this.props.user.currentUser.userName
    ) {
      return (
        <Container
          ref={ref => (this.container = ref)}
          headerProps={{
            title: '我的iTablet',
            withoutBack: true,
            navigation: this.props.navigation,
          }}
        >
          {this._selectionRender()}
        </Container>
      )
    } else {
      return <Login setUser={this.props.setUser} user={this.props.user} />
    }
  }
}

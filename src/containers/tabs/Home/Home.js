import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { Container } from '../../../components'
import { ModuleList } from './components'
import styles from './styles'
import { scaleSize } from '../../../utils'
import Toast from '../../../utils/Toast'
import { SScene, SMap, SOnlineService } from 'imobile_for_reactnative'
import FileTools from '../../../native/FileTools'
import ConstPath from '../../../constants/ConstPath'
import HomePopupModal from './HomePopupModal'
import NavigationService from '../../NavigationService'
// import Orientation from '../../../constants/Orientation'
export default class Home extends Component {
  props: {
    nav: Object,
    latestMap: Object,
    currentUser: Object,
    setShow: () => {},
    device: Object,
    importSceneWorkspace: () => {},
    importWorkspace: () => {},
    closeWorkspace: () => {},
    openWorkspace: () => {},
    setUser: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      isDownloaded: false,
      modalIsVisible: false,
    }
  }
  _onImportWorkspace = async (fileDirPath, item, isExist) => {
    try {
      if (fileDirPath !== undefined) {
        let currentUserName = this.props.currentUser.userName
        let homePath = await FileTools.appendingHomeDirectory()
        let toPath
        let lastIndexOf = fileDirPath.lastIndexOf('/')
        let fileName = fileDirPath.substring(lastIndexOf + 1)
        if (currentUserName === undefined) {
          currentUserName = ''
          toPath =
            homePath +
            ConstPath.CustomerPath +
            ConstPath.RelativePath.ExternalData +
            fileName
        } else {
          toPath =
            homePath +
            ConstPath.UserPath +
            currentUserName +
            '/' +
            ConstPath.RelativePath.ExternalData +
            fileName
        }
        let arrFilePath = await FileTools.getFilterFiles(toPath, {
          smwu: 'smwu',
          sxwu: 'sxwu',
        })
        if (arrFilePath.length === 0) {
          if (isExist) {
            item.action && item.action(this.props.currentUser)
          }
          await FileTools.copyFile(fileDirPath, toPath)
          let arrFilePath = await FileTools.getFilterFiles(fileDirPath, {
            smwu: 'smwu',
            sxwu: 'sxwu',
          })
          let filePath = arrFilePath[0].filePath
          let is3D = await SScene.is3DWorkspace({ server: filePath })
          if (is3D === true) {
            let result = await this.props.importSceneWorkspace({
              server: filePath,
            })
            if (result === true) {
              // Toast.show('导入3D成功')
            } else {
              Toast.show('导入3D失败')
            }
          } else {
            let result = await SMap.importWorkspaceInfo({
              server: filePath,
              type: 9,
            })
            if (result.length === 0) {
              Toast.show('导入失败')
            }
          }
        } else if (isExist === true) {
          item.action && item.action(this.props.currentUser)
        }
      }
    } catch (e) {
      Toast.show('导入失败')
    }
  }
  headRender() {
    let userImg = require('../../../assets/home/icon_mine_select.png')
    let moreImg = require('../../../assets/home/icon_else_selected.png')
    const title = 'SuperMap iTablet'
    return (
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.userView}>
          <Image source={userImg} style={styles.userImg} />
        </TouchableOpacity>
        <Text style={styles.headTitle}>{title}</Text>
        <TouchableOpacity style={styles.moreImg}>
          <Image
            resizeMode={'contain'}
            source={moreImg}
            style={styles.moreImg}
          />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
      </View>
    )
  }
  _closeModal = () => {
    this.setState({ modalIsVisible: false })
  }

  _onLogin = () => {
    this._closeModal()
    NavigationService.navigate('Mine')
  }
  _onRegister = () => {
    this._closeModal()
    NavigationService.navigate('Register')
  }

  _onSetting = () => {
    this._closeModal()
    NavigationService.navigate('Setting')
  }

  _onAbout = () => {
    this._closeModal()
    NavigationService.navigate('AboutITablet')
  }

  _onToggleAccount = () => {
    this._closeModal()
    NavigationService.navigate('ToggleAccount')
  }

  _onLogout = () => {
    SOnlineService.logout()
    this.props.closeWorkspace(async () => {
      let customPath = await FileTools.appendingHomeDirectory(
        ConstPath.CustomerPath + ConstPath.RelativeFilePath.Workspace,
      )
      this.props.setUser()
      NavigationService.navigate('Mine')
      this._closeModal()
      this.props.openWorkspace({ server: customPath })
    })
  }

  _renderModal = () => {
    let isLogin = this.props.currentUser.userName !== undefined
    return (
      <HomePopupModal
        isLogin={isLogin}
        onLogin={this._onLogin}
        onRegister={this._onRegister}
        onToggleAccount={this._onToggleAccount}
        onLogout={this._onLogout}
        onSetting={this._onSetting}
        onAbout={this._onAbout}
        modalVisible={this.state.modalIsVisible}
        onCloseModal={this._closeModal}
        topNavigatorBarImageId={this.topNavigatorBarImageId}
      />
    )
  }

  render() {
    let isLogin =
      this.props.currentUser.userName &&
      (this.props.currentUser.userName !== 'Customer' &&
        this.props.currentUser.password !== 'Customer')
    let userImg = isLogin
      ? {
        uri:
            'https://cdn3.supermapol.com/web/cloud/84d9fac0/static/images/myaccount/icon_plane.png',
      }
      : require('../../../assets/home/系统默认头像.png')
    let moreImg = require('../../../assets/Mine/工具条-更多-白.png')
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: 'SuperMap iTablet',
          headerLeft: (
            <TouchableOpacity
              style={styles.userView}
              onPress={() => {
                this.topNavigatorBarImageId = 'left'
                this.setState({ modalIsVisible: true })
              }}
            >
              <Image source={userImg} style={styles.userImg} />
            </TouchableOpacity>
          ),
          headerRight: (
            <TouchableOpacity
              onPress={() => {
                this.topNavigatorBarImageId = 'right'
                this.setState({ modalIsVisible: true })
              }}
              // style={{ flex: 1, marginRight: scaleSize(18.5) }}
            >
              <Image
                resizeMode={'contain'}
                source={moreImg}
                style={styles.userImg}
              />
            </TouchableOpacity>
          ),
          headerStyle: {
            height: scaleSize(80),
          },
        }}
        style={styles.container}
      >
        <View
          style={{
            flex: 1,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ModuleList
            importWorkspace={this._onImportWorkspace}
            currentUser={this.props.currentUser}
            styles={styles.modulelist}
            device={this.props.device}
          />
          {this._renderModal()}
        </View>
      </Container>
    )
  }
}

/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/
import React, { Component } from 'react'
import {
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
  SectionList,
  Dimensions,
} from 'react-native'
import { Container } from '../../../../components'
import RenderServiceItem from './RenderServiceItem'
import { SOnlineService } from 'imobile_for_reactnative'
import styles, { color } from './Styles'
import PopupModal from './PopupModal'
import Toast from '../../../../utils/Toast'

/**
 * 变量命名规则：私有为_XXX, 若变量为一个对象，则命名为 objXXX,若为一个数组，则命名为 arrXXX,...
 * */

let _arrPrivateServiceList = []
let _arrPublishServiceList = []
/** 当前页加载多少条服务数据*/
let _iServicePageSize = 9
let _loadCount = 1
export default class MyService extends Component {
  props: {
    navigation: Object,
    user: Object,
    setUser: () => {},
  }
  constructor(props) {
    super(props)
    this.screenWidth = Dimensions.get('window').width
    this.publishServiceTitle = '共有服务'
    this.privateServiceTitle = '私有服务'
    this.state = {
      arrPrivateServiceList: _arrPrivateServiceList,
      arrPublishServiceList: _arrPublishServiceList,
      bPrivateServiceShow: true,
      bPublishServiceShow: true,
      selections: [
        { title: this.privateServiceTitle, data: _arrPrivateServiceList },
        { title: this.publishServiceTitle, data: _arrPublishServiceList },
      ],
      modalIsVisible: false,
      isRefreshing: false,
      progressWidth: this.screenWidth * 0.6,
    }

    this.serviceListTotal = -1
    this._renderItem = this._renderItem.bind(this)
    this._renderSectionHeader = this._renderSectionHeader.bind(this)
  }

  componentDidMount() {
    this._initFirstSectionData()
  }
  componentWillUnmount() {
    this._clearInterval()
  }
  _clearInterval = () => {
    if (this.objProgressWidth !== undefined) {
      clearInterval(this.objProgressWidth)
      this.setState({ progressWidth: this.screenWidth })
    }
  }
  _initFirstSectionData = async () => {
    try {
      this._showLoadProgressView()
      await this._initSectionsData(1, _iServicePageSize)
    } finally {
      this._clearInterval()
    }
  }
  _showLoadProgressView = () => {
    this.objProgressWidth = setInterval(() => {
      let prevProgressWidth = this.state.progressWidth
      let currentPorWidth
      if (prevProgressWidth >= this.screenWidth - 200) {
        currentPorWidth = prevProgressWidth + 1
        if (currentPorWidth >= this.screenWidth - 50) {
          currentPorWidth = this.screenWidth - 50
          return
        }
      } else {
        currentPorWidth = prevProgressWidth * 1.01
      }
      this.setState({ progressWidth: currentPorWidth })
    }, 100)
  }
  _initSectionsData = async (currentPage, pageSize) => {
    try {
      let arrPublishServiceList = []
      let arrPrivateServiceList = []
      let strServiceList = await SOnlineService.getServiceList(1, pageSize)
      if (typeof strServiceList === 'string') {
        let objServiceList = JSON.parse(strServiceList)
        this.serviceListTotal = objServiceList.total

        /** 构造SectionsData数据*/
        for (let page = 1; page <= currentPage; page++) {
          if (page > 1) {
            strServiceList = await SOnlineService.getServiceList(page, pageSize)
            objServiceList = JSON.parse(strServiceList)
          }

          let objArrServiceContent = objServiceList.content
          for (let i = 0; i < objArrServiceContent.length; i++) {
            let objContent = objArrServiceContent[i]
            let arrScenes = objContent.scenes
            let arrMapInfos = objContent.mapInfos
            let strThumbnail = objContent.thumbnail
            let strRestTitle = objContent.resTitle
            let strID = objContent.id
            let bIsPublish = false
            let objArrAuthorizeSetting = objContent.authorizeSetting
            for (let j = 0; j < objArrAuthorizeSetting.length; j++) {
              let strPermissionType = objArrAuthorizeSetting[j].permissionType
              if (strPermissionType === 'READ') {
                bIsPublish = true
                break
              }
            }
            let strSectionsData =
              '{"restTitle":"' +
              strRestTitle +
              '","thumbnail":"' +
              strThumbnail +
              '","id":"' +
              strID +
              '","scenes":' +
              JSON.stringify(arrScenes) +
              ',"mapInfos":' +
              JSON.stringify(arrMapInfos) +
              ',"isPublish":' +
              bIsPublish +
              '}'
            let objSectionsData = JSON.parse(strSectionsData)
            if (bIsPublish) {
              arrPublishServiceList.push(objSectionsData)
            } else {
              arrPrivateServiceList.push(objSectionsData)
            }
          }
        }
        /** 重新赋值，避免浅拷贝*/
        _arrPrivateServiceList = arrPrivateServiceList
        _arrPublishServiceList = arrPublishServiceList
      }
      if (_arrPrivateServiceList.length === 0) {
        _arrPrivateServiceList.push({})
      }
      if (_arrPublishServiceList.length === 0) {
        _arrPublishServiceList.push({})
      }
      this.setState({
        arrPrivateServiceList: _arrPrivateServiceList,
        arrPublishServiceList: _arrPublishServiceList,
      })
    } catch (e) {
      Toast.show('登录失效，请重新登录')
      this.setState({ isRefreshing: false })
    }
  }

  _isShowRenderItem = (isShow: boolean, title: string) => {
    if (title === this.publishServiceTitle) {
      this.setState({ bPublishServiceShow: !isShow })
    } else if (title === this.privateServiceTitle) {
      this.setState({ bPrivateServiceShow: !isShow })
    }
  }

  _renderSectionHeader(section) {
    let title = section.section.title
    if (title !== undefined) {
      return (
        <Text
          style={[styles.titleTextStyle, { fontSize: 18, fontWeight: 'bold' }]}
          onPress={() => {
            this._isShowRenderItem(section.section.isShowItem, title)
          }}
        >
          {title}
        </Text>
      )
    }
    return <View />
  }
  _renderItem(info) {
    let restTitle = info.item.restTitle
    let display = info.section.isShowItem ? 'flex' : 'none'
    if (restTitle !== undefined) {
      let index = info.index
      let imageUri = info.item.thumbnail
      let isPublish = info.item.isPublish
      let itemId = info.item.id
      let scenes = info.item.scenes
      let mapInfos = info.item.mapInfos
      return (
        <RenderServiceItem
          display={display}
          onItemPress={this._onItemPress}
          imageUrl={imageUri}
          restTitle={restTitle}
          isPublish={isPublish}
          itemId={itemId}
          index={index}
          scenes={scenes}
          mapInfos={mapInfos}
        />
      )
    }
    return (
      <View display={display}>
        <Text
          style={[
            styles.titleTextStyle,
            { backgroundColor: color.content, textAlign: 'center' },
          ]}
        >
          没有服务
        </Text>
      </View>
    )
  }

  _keyExtractor = (item, index) => {
    if (item.id === undefined) {
      return index * index
    }
    return item.id
  }

  _onItemPress = (isPublish, itemId, restTitle, index) => {
    this.onClickItemId = itemId
    this.onClickItemRestTitle = restTitle
    this.onClickItemIsPublish = isPublish
    this.onClickItemIndex = index
    this.setState({ modalIsVisible: true })
  }

  _onCloseModal = () => {
    this.setState({ modalIsVisible: false })
  }

  _renderModal = () => {
    if (this.state.modalIsVisible) {
      return (
        <PopupModal
          onRefresh={this._onModalRefresh2}
          onCloseModal={this._onCloseModal}
          modalVisible={this.state.modalIsVisible}
          title={this.onClickItemRestTitle}
          isPublish={this.onClickItemIsPublish}
          itemId={this.onClickItemId}
          index={this.onClickItemIndex}
        />
      )
    }
  }

  _onModalRefresh = async () => {
    if (!this.state.isRefreshing) {
      this.setState({ isRefreshing: true })
      await this._initSectionsData(_loadCount, _iServicePageSize)
      this.setState({ isRefreshing: false })
    }
  }

  _onModalRefresh2 = async (itemId, isPublish, isDelete, index) => {
    if (index !== undefined) {
      if (isPublish) {
        if (isDelete) {
          _arrPublishServiceList.splice(index, 1)
          let total = this.serviceListTotal - 1
          this.serviceListTotal = total
        } else {
          let objPublishList = _arrPublishServiceList[index]
          let strRestTitle = objPublishList.restTitle
          let strThumbnail = objPublishList.thumbnail
          let strID = objPublishList.id
          let arrScenes = objPublishList.scenes
          let arrMapInfos = objPublishList.mapInfos
          let bIsPublish = false
          let strSectionsData =
            '{"restTitle":"' +
            strRestTitle +
            '","thumbnail":"' +
            strThumbnail +
            '","id":"' +
            strID +
            '","scenes":' +
            JSON.stringify(arrScenes) +
            ',"mapInfos":' +
            JSON.stringify(arrMapInfos) +
            ',"isPublish":' +
            bIsPublish +
            '}'
          let objPrivateList = JSON.parse(strSectionsData)
          if (
            _arrPrivateServiceList.length === 1 &&
            _arrPrivateServiceList[0].id === undefined
          ) {
            _arrPrivateServiceList.splice(0, 1)
          }

          _arrPrivateServiceList.push(objPrivateList)
          _arrPublishServiceList.splice(index, 1)
        }
      } else {
        if (isDelete) {
          _arrPrivateServiceList.splice(index, 1)
          let total = this.serviceListTotal - 1
          this.serviceListTotal = total
        } else {
          let objPrivateList = _arrPrivateServiceList[index]
          let strRestTitle = objPrivateList.restTitle
          let strThumbnail = objPrivateList.thumbnail
          let strID = objPrivateList.id
          let arrScenes = objPrivateList.scenes
          let arrMapInfos = objPrivateList.mapInfos
          let bIsPublish = true
          let strSectionsData =
            '{"restTitle":"' +
            strRestTitle +
            '","thumbnail":"' +
            strThumbnail +
            '","id":"' +
            strID +
            '","scenes":' +
            JSON.stringify(arrScenes) +
            ',"mapInfos":' +
            JSON.stringify(arrMapInfos) +
            ',"isPublish":' +
            bIsPublish +
            '}'
          let objPublishList = JSON.parse(strSectionsData)
          if (
            _arrPublishServiceList.length === 1 &&
            _arrPublishServiceList[0].id === undefined
          ) {
            _arrPublishServiceList.splice(0, 1)
          }
          _arrPublishServiceList.push(objPublishList)
          _arrPrivateServiceList.splice(index, 1)
        }
      }
      if (_arrPrivateServiceList.length === 0) {
        _arrPrivateServiceList.push({})
      }
      if (_arrPublishServiceList.length === 0) {
        _arrPublishServiceList.push({})
      }
    }

    this.setState({
      arrPrivateServiceList: _arrPrivateServiceList,
      arrPublishServiceList: _arrPublishServiceList,
    })
  }

  _onRefresh = async () => {
    if (!this.state.isRefreshing) {
      _loadCount = 1
      this.setState({
        isRefreshing: true,
        bPrivateServiceShow: true,
        bPublishServiceShow: true,
      })
      await this._initSectionsData(1, _iServicePageSize)
      this.setState({ isRefreshing: false })
    }
  }
  _loadData = async () => {
    let publishLength = _arrPublishServiceList.length
    if (
      _arrPublishServiceList.length === 1 &&
      _arrPublishServiceList[0].id === undefined
    ) {
      publishLength = 0
    }
    let privateLength = _arrPrivateServiceList.length
    if (
      _arrPrivateServiceList.length === 1 &&
      _arrPrivateServiceList[0].id === undefined
    ) {
      privateLength = 0
    }
    let loadServiceCount = publishLength + privateLength
    if (
      this.serviceListTotal > _loadCount * _iServicePageSize &&
      this.serviceListTotal > loadServiceCount &&
      (this.state.bPublishServiceShow || this.state.bPrivateServiceShow)
    ) {
      _loadCount = ++_loadCount
      await this._initSectionsData(_loadCount, _iServicePageSize)
    }
  }
  _footView = () => {
    let publishLength = _arrPublishServiceList.length
    if (
      _arrPublishServiceList.length === 1 &&
      _arrPublishServiceList[0].id === undefined
    ) {
      publishLength = 0
    }
    let privateLength = _arrPrivateServiceList.length
    if (
      _arrPrivateServiceList.length === 1 &&
      _arrPrivateServiceList[0].id === undefined
    ) {
      privateLength = 0
    }
    let loadServiceCount = publishLength + privateLength
    if (
      this.serviceListTotal > loadServiceCount &&
      (this.state.bPublishServiceShow || this.state.bPrivateServiceShow) &&
      !this.state.isRefreshing
    ) {
      return (
        <View
          style={{
            flex: 1,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: color.content,
          }}
        >
          <ActivityIndicator
            style={{
              flex: 1,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            color={'orange'}
            animating={true}
          />
          <Text
            style={{
              flex: 1,
              lineHeight: 20,
              fontSize: 12,
              textAlign: 'center',
              color: 'white',
            }}
          >
            加载中...
          </Text>
        </View>
      )
    } else {
      return (
        <View>
          <Text
            style={{
              flex: 1,
              lineHeight: 30,
              fontSize: 12,
              textAlign: 'center',
              backgroundColor: color.content,
            }}
          >
            -----这是底线-----
          </Text>
        </View>
      )
    }
  }
  _render = () => {
    if (
      _arrPublishServiceList.length === 0 &&
      _arrPrivateServiceList.length === 0
    ) {
      return (
        <View style={styles.noDataViewStyle}>
          <View
            style={{
              height: 2,
              width: this.state.progressWidth,
              backgroundColor: '#1c84c0',
            }}
          />
        </View>
      )
    } else {
      return (
        <View style={{ flex: 1 }}>
          <SectionList
            style={styles.haveDataViewStyle}
            sections={[
              {
                title: this.privateServiceTitle,
                data: this.state.arrPrivateServiceList,
                isShowItem: this.state.bPrivateServiceShow,
              },
              {
                title: this.publishServiceTitle,
                data: this.state.arrPublishServiceList,
                isShowItem: this.state.bPublishServiceShow,
              },
            ]}
            renderItem={this._renderItem}
            renderSectionHeader={this._renderSectionHeader}
            keyExtractor={this._keyExtractor}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh}
                colors={['orange', 'red']}
                tintColor={'white'}
                title={'刷新中...'}
                enabled={true}
              />
            }
            onEndReachedThreshold={0.5}
            onEndReached={this._loadData}
            ListFooterComponent={this._footView}
          />
          {this._renderModal()}
        </View>
      )
    }
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: '我的服务',
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        {this._render()}
      </Container>
    )
  }
}

/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View, Image, Text, Switch, TouchableOpacity } from 'react-native'
import { ImageButton, PopModal } from '../../../components'
import { scaleSize } from '../../../utils'
import { CheckStatus } from '../../../constants'
import { color } from '../../../styles'
import { getPublicAssets } from '../../../assets'
import NavigationService from '../../NavigationService'
import styles from '../styles'

export default class MapCutSetting extends React.Component {
  props: {
    datasources: Array,
    configAction?: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      data: this.initData(),
    }

    this.changeDSData = null
  }

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate =
      JSON.stringify(nextProps.datasources) !==
      JSON.stringify(this.props.datasources)

    shouldUpdate = shouldUpdate || !nextState.data.compare(this.state.data)

    return shouldUpdate
  }

  initData = () => {
    const data = (new Map(): Map<string, Object>)
    data.set('ds', {
      selected: true,
      title: '目标数据源',
      dsName: this.props.datasources[0] ? this.props.datasources[0].alias : '',
    })
    data.set('range', {
      selected: true,
      title: '区域内裁剪',
      value: true,
    })
    data.set('erase', {
      selected: true,
      title: '擦除裁剪区域',
      value: true,
    })
    data.set('exactCut', {
      selected: true,
      title: '精确裁剪',
      value: true,
    })
    return data
  }

  componentDidMount() {}

  showModal = isShow => {
    this.settingModal && this.settingModal.setVisible(isShow)
  }

  /** 多选框 **/
  renderCheckButton = ({ status = 0, data }) => {
    let icon = this.state.sectionSelected
      ? getPublicAssets().common.icon_check
      : getPublicAssets().common.icon_uncheck
    switch (status) {
      case CheckStatus.UN_CHECK:
        icon = getPublicAssets().common.icon_uncheck
        break
      case CheckStatus.CHECKED:
        icon = getPublicAssets().common.icon_check
        break
      case CheckStatus.UN_CHECK_DISABLE:
        icon = getPublicAssets().common.icon_uncheck_disable
        break
      case CheckStatus.CHECKED_DISABLE:
        icon = getPublicAssets().common.icon_check_disable
        break
    }
    return (
      <ImageButton
        iconBtnStyle={styles.selectImgView}
        iconStyle={styles.selectImg}
        icon={icon}
        onPress={() => {
          if (!data) return
          this.setState(state => {
            const newData = new Map(state.data)
            let item = newData.get(data.key)
            item.selected = !item.selected
            newData.set(data.key, item)
            return { data: newData }
          })
        }}
      />
    )
  }

  renderTop = () => {
    return (
      <View style={styles.settingTopView}>
        <Text style={styles.settingTopTitle}>统一设置</Text>
      </View>
    )
  }

  renderArrowItem = ({ item, key, action }) => {
    return (
      <View key={key} style={[styles.topView, { width: '100%' }]}>
        <View style={styles.topLeftView}>
          {this.renderCheckButton({
            status: item.selected ? CheckStatus.CHECKED : CheckStatus.UN_CHECK,
            data: { item, key },
          })}
          <Text style={styles.content}>{item.title}</Text>
        </View>
        <TouchableOpacity
          onPress={() => action && action()}
          activeOpacity={0.8}
          style={[styles.topRightView, { width: scaleSize(360) }]}
        >
          <Text style={[styles.content, { width: scaleSize(140) }]}>
            {this.props.datasources[0] ? this.props.datasources[0].alias : ''}
          </Text>
          <Image
            resizeMode="contain"
            style={styles.downImg}
            source={require('../../../assets/Mine/mine_my_arrow.png')}
          />
        </TouchableOpacity>
      </View>
    )
  }

  renderSwitchItem = ({ item, key }) => {
    return (
      <View key={key} style={[styles.topView, { width: '100%' }]}>
        <View style={styles.topLeftView}>
          {this.renderCheckButton({
            status: item.selected ? CheckStatus.CHECKED : CheckStatus.UN_CHECK,
            data: { item, key },
          })}
          <Text style={styles.content}>{item.title}</Text>
        </View>
        <View style={[styles.topRightView, { width: scaleSize(360) }]}>
          <Switch
            style={styles.switch}
            trackColor={{ false: color.bgG, true: color.switch }}
            thumbColor={item.value ? color.bgW : color.bgW}
            ios_backgroundColor={item.value ? color.switch : color.bgG}
            value={item.value}
            onValueChange={value => {
              this.setState(state => {
                const newData = new Map().clone(state.data)
                let item = newData.get(key)
                item.value = value
                newData.set(key, item)
                return { data: newData }
              })
            }}
          />
        </View>
      </View>
    )
  }

  /** 中间组件 **/
  renderContent = () => {
    let arr = []
    this.state.data.forEach((value, key) => {
      if (key === 'ds') {
        arr.push(
          this.renderArrowItem({
            item: value,
            key,
            action: () => {
              this.showModal(false)
              NavigationService.navigate('MapCutDS', {
                data: this.props.datasources,
                cb: ({ item }) => {
                  const newData = new Map(this.state.data)
                  let dsData = newData.get('ds')
                  if (dsData.dsName !== item.alias) {
                    dsData.dsName = item.alias
                    newData.set('ds', dsData)
                    this.setState(
                      {
                        data: newData,
                      },
                      () => {
                        this.props.configAction &&
                          this.props.configAction(this.state.data)
                      },
                    )
                  }
                },
              })
            },
          }),
        )
      } else {
        arr.push(this.renderSwitchItem({ item: value, key }))
      }
    })
    return <View style={styles.settingContentView}>{arr}</View>
  }

  renderBottom = () => {
    return (
      <View style={[styles.settingBtnView, { width: '100%' }]}>
        <TouchableOpacity
          style={styles.settingBtn}
          onPress={() =>
            this.settingModal && this.settingModal.setVisible(false)
          }
        >
          <Text style={styles.closeText}>取消</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingBtn}
          onPress={() => {
            this.settingModal && this.settingModal.setVisible(false)
            this.props.configAction && this.props.configAction(this.state.data)
          }}
        >
          <Text style={styles.closeText}>确定</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <PopModal ref={ref => (this.settingModal = ref)}>
        <View style={[styles.popView, { width: '100%' }]}>
          {this.renderTop()}
          {this.renderContent()}
          {this.renderBottom()}
        </View>
      </PopModal>
    )
  }
}
import React, { Component } from 'react'
import { color } from '../../styles'
import { View, Text, Switch } from 'react-native'
import styles from './styles'
export default class MapSetting extends Component {
  props: {
    data: Array,
    onPress: () => {},
    mapSetting: any,
    index: number,
  }

  _onValueChange = (value, item, index) => {
    this.props.onPress && this.props.onPress({ value, item, index })
  }

  render() {
    if (this.props.data.isShow) {
      if (typeof this.props.data.value === 'boolean') {
        return (
          <View>
            <View style={styles.row}>
              <Text style={styles.itemName}>{this.props.data.name}</Text>
              <Switch
                style={styles.switch}
                trackColor={{ false: 'white', true: '#505050' }}
                thumbColor={this.props.data.value ? 'white' : '#505050'}
                ios_backgroundColor={
                  this.props.data.value ? color.theme : color.border
                }
                value={this.props.data.value}
                onValueChange={value => {
                  this._onValueChange(value, this.props.data, this.props.index)
                }}
              />
            </View>
            <View style={styles.itemSeparator} />
          </View>
        )
      } else {
        return (
          <View>
            <View style={styles.row}>
              <Text style={styles.itemName}>{this.props.data.name}</Text>
              <Text style={styles.itemValue}>{this.props.data.value}</Text>
            </View>
            <View style={styles.itemSeparator} />
          </View>
        )
      }
    } else {
      return <View />
    }
  }
}

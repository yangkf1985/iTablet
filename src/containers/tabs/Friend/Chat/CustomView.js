import PropTypes from 'prop-types'
import React from 'react'
import {
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ViewPropTypes,
  Text,
  View,
} from 'react-native'
import MapView from 'react-native-maps'
//import { scaleSize } from '../../../../utils/screen'

export default class CustomView extends React.Component {
  props: {
    user: Object,
    currentMessage: any,
  }

  render() {
    if (
      this.props.currentMessage.message.type &&
      this.props.currentMessage.message.type === 6
    ) {
      let fileSize = this.props.currentMessage.message.message.fileSize
      let fileSizeText = ''
      if (fileSize > 1024) {
        fileSize = fileSize / 1024
        fileSizeText = fileSize.toFixed(2) + 'KB'
      }
      if (fileSize > 1024) {
        fileSize = fileSize / 1024
        fileSizeText = fileSize.toFixed(2) + 'MB'
      }
      return (
        <View
          style={
            this.props.currentMessage.user._id !== this.props.user._id
              ? styles.container1
              : [styles.container1, styles.container2]
          }
        >
          <Text style={styles.fileName}>
            {this.props.currentMessage.message.message.fileName}
          </Text>
          <Text style={styles.fileSize}>{fileSizeText}</Text>
        </View>
      )
    }
    if (this.props.currentMessage.location) {
      return (
        <TouchableOpacity
          style={[styles.mapView, this.props.containerStyle]}
          onPress={() => {
            const url = Platform.select({
              ios: `http://maps.apple.com/?ll=${
                this.props.currentMessage.location.latitude
              },${this.props.currentMessage.location.longitude}`,
              android: `http://maps.google.com/?q=${
                this.props.currentMessage.location.latitude
              },${this.props.currentMessage.location.longitude}`,
            })
            Linking.canOpenURL(url)
              .then(supported => {
                if (supported) {
                  return Linking.openURL(url)
                }
              })
              // eslint-disable-next-line
              .catch(err => {
                // console.error('An error occurred', err)
              })
          }}
        >
          <MapView
            style={[styles.mapView, this.props.mapViewStyle]}
            region={{
              latitude: this.props.currentMessage.location.latitude,
              longitude: this.props.currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          />
        </TouchableOpacity>
      )
    }
    return null
  }
}

const styles = StyleSheet.create({
  container: {},
  container1: {
    backgroundColor: 'white',
    width: 150,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  container2: {
    alignItems: 'flex-start',
  },
  fileName: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 14,
    color: 'black',
  },
  fileSize: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    fontSize: 12,
  },
  mapView: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
  },
})

CustomView.defaultProps = {
  currentMessage: {},
  containerStyle: {},
  mapViewStyle: {},
}

CustomView.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  mapViewStyle: ViewPropTypes.style,
}

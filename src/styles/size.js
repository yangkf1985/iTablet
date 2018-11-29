import { Dimensions, Platform } from 'react-native'
import { scaleSize } from '../utils'

const screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  onePixel: 1 / 2,
  statusBarHeight: Platform.OS === 'ios' ? 20 : 0,
}

const fontSize = {
  fontSizeXl: scaleSize(26),
  fontSizeLg: scaleSize(24),
  fontSizeMd: scaleSize(22),
  fontSizeSm: scaleSize(20),
  fontSizeXs: scaleSize(18),
}

const layoutSize = {
  horizonWidth: 15,
  verticalHeight: 15,
}

export default {
  screen,
  fontSize,
  layoutSize,
}

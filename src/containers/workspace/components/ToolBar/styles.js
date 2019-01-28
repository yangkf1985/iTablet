import { StyleSheet } from 'react-native'
import { scaleSize, screen } from '../../../../utils'
import { color, zIndexLevel, size } from '../../../../styles'
import { ConstToolType, Const } from '../../../../constants'

export default StyleSheet.create({
  fullContainer: {
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    right: 0,
    height: screen.deviceHeight,
    backgroundColor: '#rgba(0, 0, 0, 0)',
    // backgroundColor:"pink",
    zIndex: zIndexLevel.FOUR,
  },
  wrapContainer: {
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#rgba(0, 0, 0, 0)',
    zIndex: zIndexLevel.FOUR,
  },
  themeoverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    // zIndex: zIndexLevel.FOUR,
  },
  overlay: {
    flex: 1,
    backgroundColor: '#rgba(105, 105, 105, 0.3)',
    // zIndex: zIndexLevel.FOUR,
  },
  containers: {
    flexDirection: 'column',
    width: '100%',
    maxHeight: ConstToolType.HEIGHT[3] + Const.BOTTOM_HEIGHT,
    minHeight: Const.BOTTOM_HEIGHT,
    backgroundColor: color.theme,
    // backgroundColor:"red",
    // zIndex: zIndexLevel.FOUR,
  },
  // box: {
  //   position: 'absolute',
  //   left: 0,
  //   right: 0,
  //   bottom: Const.BOTTOM_HEIGHT,
  // },
  buttonz: {
    flexDirection: 'row',
    height: Const.BOTTOM_HEIGHT,
    paddingHorizontal: scaleSize(20),
    backgroundColor: color.theme,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    // flex: 1,
    height: scaleSize(60),
    width: scaleSize(60),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.theme,
  },
  img: {
    height: scaleSize(45),
    width: scaleSize(45),
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    fontSize: 23,
    fontWeight: 'bold',
    backgroundColor: color.theme,
    color: 'white',
  },
  item: {
    padding: 10,
    fontSize: 18,
    paddingLeft: 20,
    height: 44,
    backgroundColor: color.theme,
    color: 'white',
  },
  themeitem: {
    padding: 10,
    fontSize: 25,
    paddingLeft: 20,
    height: 60,
    backgroundColor: color.theme,
    color: 'white',
  },
  cell: {
    // flex: 1,
  },
  tabsView: {
    height: ConstToolType.HEIGHT[3] - Const.BOTTOM_HEIGHT,
  },
  table: {
    flex: 1,
    paddingHorizontal: scaleSize(30),
    alignItems: 'center',
    backgroundColor: color.subTheme,
  },
  list: {
    width: scaleSize(300),
    position: 'absolute',
    top: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(48,48,48,0.85)',
  },
  text: {
    color: 'white',
    fontSize: size.fontSize.fontSizeLg,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(80),
    backgroundColor: 'transparent',
    minWidth: scaleSize(100),
    width: scaleSize(300),
  },
})

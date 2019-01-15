import { StyleSheet, Platform } from 'react-native'
import { scaleSize, setSpText } from '../../utils'
import { color } from '../../styles'

export const HEADER_HEIGHT = scaleSize(44) + (Platform.OS === 'ios' ? 20 : 0)
export const HEADER_PADDINGTOP = Platform.OS === 'ios' ? 20 : 0

export default StyleSheet.create({
  defaultHeaderView: {
    width: '100%',
    paddingTop: HEADER_PADDINGTOP,
    height: HEADER_HEIGHT,
    // borderBottomWidth: 1,
    // borderBottomColor: '#e2e2e2',
    flexDirection: 'row',
    backgroundColor: color.theme,
    alignItems: 'center',
  },
  fixHeaderView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10001,
    width: '100%',
    paddingTop: HEADER_PADDINGTOP,
    height: HEADER_HEIGHT,
    backgroundColor: color.theme,
    flexDirection: 'row',
    alignItems: 'center',
  },
  floatHeaderView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10001,
    width: '100%',
    paddingTop: HEADER_PADDINGTOP,
    height: HEADER_HEIGHT,
    backgroundColor: '#rgba(255, 255, 255, 0)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  floatNoTitleHeaderView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100019,
    width: '100%',
    paddingTop: HEADER_PADDINGTOP,
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#rgba(255, 255, 255, 0)',
  },
  navigationHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    position: 'absolute',
    zIndex: 10001,
    width: scaleSize(24),
    marginLeft: scaleSize(18.5),
    justifyContent: 'center',
    // alignItems: 'flex-start',
  },
  backIcon: {
    // width: 9,
    // height: 14,
    width: scaleSize(24),
    height: scaleSize(24),
    backgroundColor: '#rgba(255, 255, 255, 0)',
    marginRight: 3,
  },
  iconBtnBg: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBtnBgDarkColor: {
    backgroundColor: '#rgba(0, 0, 0, 0.6)',
  },
  headerLeftView: {
    position: 'absolute',
    zIndex: 10001,
    width: 60,
    padding: scaleSize(5),
    marginLeft: scaleSize(13.5),
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  headerRightView: {
    position: 'absolute',
    zIndex: 10001,
    height: scaleSize(30),
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    right: scaleSize(12.5),
    backgroundColor: 'transparent',
  },
  headerTitleView: {
    position: 'absolute',
    zIndex: -1,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    // fontSize: 18,
    // color: '#222222',
    color: 'white',
    fontSize: setSpText(18),
    // fontWeight: 'bold',
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  count: {
    position: 'absolute',
    color: '#fa575c',
    left: 38,
  },
})

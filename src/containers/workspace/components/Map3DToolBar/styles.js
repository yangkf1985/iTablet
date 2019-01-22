import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import { color } from '../../../../styles'
export default StyleSheet.create({
  sectionHeader: {
    fontSize: setSpText(28),
    fontWeight: 'bold',
    backgroundColor: color.theme,
    color: 'white',
  },
  item: {
    padding: scaleSize(5),
    fontSize: setSpText(22),
    paddingLeft: scaleSize(20),
    height: scaleSize(50),
    backgroundColor: color.theme,
    color: 'white',
  },
  Separator: {
    flex: 1,
    height: scaleSize(15),
  },
  text: {
    fontSize: setSpText(22),
    color: 'white',
  },
  key: {
    // width:scaleSize(200),
    flex: 4,
    height: scaleSize(60),
    // fontSize: scaleSize(22),
    alignItems: 'center',
    justifyContent: 'center',
    // textAlignVertical: 'center',
    backgroundColor: '#2D2D2F',
    borderBottomWidth: scaleSize(0.5),
    borderBottomColor: '#C4C4C4',
  },
  value: {
    // width:scaleSize(520),
    flex: 6,
    height: scaleSize(60),
    // fontSize: scaleSize(22),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F4F4F',
    borderBottomWidth: scaleSize(0.5),
    borderBottomColor: '#C4C4C4',
  },
  name: {
    width: scaleSize(200),
    height: scaleSize(40),
    fontSize: setSpText(24),
    color: 'white',
    textAlign: 'center',
    // backgroundColor:"blue",
    alignItems: 'center',
  },
  result: {
    // width: scaleSize(300),
    flex: 1,
    height: scaleSize(40),
    fontSize: setSpText(24),
    color: 'white',
    textAlign: 'center',
    // backgroundColor:"white",
  },
  row: {
    flex: 1,
    height: scaleSize(61),
    flexDirection: 'row',
  },
  analystView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    // backgroundColor:"red",
    // alignItems:"center",
    marginTop: scaleSize(20),
  },
  container: {
    flex: 1,
  },
  sceneItem: {
    flex: 1,
    marginTop: scaleSize(20),
  },
})

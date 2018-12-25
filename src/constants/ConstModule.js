import NavigationService from '../containers/NavigationService'
import constants from '../containers/workspace/constants'
import { FileTools } from '../native'
import ConstToolType from './ConstToolType'
import ConstOnline from './ConstOnline'
import { ConstPath } from '../constants'
import { Platform } from 'react-native'

export default [
  {
    key: '地图制图',
    title: '地图制图',
    baseImage: require('../assets/home/icon_lefttop_free.png'),
    moduleImage: require('../assets/home/icon_cartography.png'),
    action: async user => {
      GLOBAL.Type = constants.MAP_EDIT
      const customerPath =
        ConstPath.CustomerPath + ConstPath.RelativeFilePath.Workspace
      // let exist = await FileTools.fileIsExistInHomeDirectory(customerPath)
      let wsPath
      if (user.userName) {
        const userWSPath =
          ConstPath.UserPath +
          user.userName +
          '/' +
          ConstPath.RelativeFilePath.Workspace
        wsPath = await FileTools.appendingHomeDirectory(userWSPath)
      } else {
        wsPath = await FileTools.appendingHomeDirectory(customerPath)
      }
      NavigationService.navigate('MapView', {
        operationType: constants.MAP_EDIT,
        wsData: [
          {
            DSParams: { server: wsPath },
            type: 'Workspace',
          },
          ConstOnline['Google'],
        ],
        mapName: '地图制图',
        isExample: false,
      })
    },
  },
  {
    key: '三维场景',
    title: '三维场景',
    baseImage: require('../assets/home/icon_rightbottom_free.png'),
    moduleImage: require('../assets/home/icon_map3D.png'),
    action: async user => {
      GLOBAL.Type = ConstToolType.MAP_3D
      let customerPath
      let default3DDataPath
      if (Platform.OS === 'android') {
        default3DDataPath = 'OlympicGreen_android/OlympicGreen_android.sxwu'
      } else {
        default3DDataPath = 'OlympicGreen_ios/OlympicGreen_ios.sxwu'
      }
      customerPath =
        ConstPath.CustomerPath +
        ConstPath.RelativeFilePath.Scene +
        default3DDataPath

      let ssPath = await FileTools.appendingHomeDirectory(customerPath)
      if (user.userName) {
        const userWSPath =
          ConstPath.UserPath +
          user.userName +
          '/' +
          ConstPath.RelativeFilePath.Scene +
          default3DDataPath
        ssPath = await FileTools.appendingHomeDirectory(userWSPath)
      } else {
        ssPath = await FileTools.appendingHomeDirectory(customerPath)
      }
      NavigationService.navigate('Map3D', {
        path: ssPath,
        type: ConstToolType.MAP_3D,
      })
    },
  },
  // {
  //   key: 'AR地图',
  //   title: 'AR地图',
  //   baseImage: require('../assets/home/icon_lefttop_vip.png'),
  //   moduleImage: require('../assets/home/icon_ARmap.png'),
  // },
  // {
  //   key: '导航地图',
  //   title: '导航地图',
  //   baseImage: require('../assets/home/icon_rightbottom_vip.png'),
  //   moduleImage: require('../assets/home/icon_navigation.png'),
  //   action: () => {
  //     // NavigationService.navigate('MapView', { // 若未登录，则打开游客工作空间
  //     //   wsData: ConstOnline['Baidu'],
  //     //   isExample: false,
  //     // })
  //   },
  // },
  {
    key: '专题地图',
    title: '专题地图',
    baseImage: require('../assets/home/icon_lefttop_vip.png'),
    moduleImage: require('../assets/home/icon_thematicmap.png'),
    action: async user => {
      GLOBAL.Type = constants.MAP_THEME
      const customerPath =
        ConstPath.CustomerPath + ConstPath.RelativeFilePath.Workspace
      let wsPath
      if (user.userName) {
        const userWSPath =
          ConstPath.UserPath +
          user.userName +
          '/' +
          ConstPath.RelativeFilePath.Workspace
        wsPath = await FileTools.appendingHomeDirectory(userWSPath)
      } else {
        wsPath = await FileTools.appendingHomeDirectory(customerPath)
      }
      NavigationService.navigate('ThemeMapView', {
        operationType: constants.MAP_THEME,
        wsData: [
          {
            DSParams: { server: wsPath },
            type: 'Workspace',
          },
          ConstOnline['Google'],
        ],
        mapName: '专题制图',
        isExample: false,
      })
    },
  },
  {
    key: '外业采集',
    title: '外业采集',
    baseImage: require('../assets/home/icon_rightbottom_vip.png'),
    moduleImage: require('../assets/home/icon_collection.png'),
    action: async user => {
      GLOBAL.Type = constants.COLLECTION
      const customerPath =
        ConstPath.CustomerPath + ConstPath.RelativeFilePath.Workspace
      // let exist = await FileTools.fileIsExistInHomeDirectory(customerPath)
      // let wsPath
      // const customerPath =
      //   ConstPath.LocalDataPath + 'IndoorNavigationData/beijing.smwu'
      let wsPath = await FileTools.appendingHomeDirectory(customerPath)
      // let exist = await FileTools.fileIsExistInHomeDirectory(customerPath)
      if (user.userName) {
        const userWSPath =
          ConstPath.UserPath +
          user.userName +
          '/' +
          ConstPath.RelativeFilePath.Workspace
        wsPath = await FileTools.appendingHomeDirectory(userWSPath)
      } else {
        wsPath = await FileTools.appendingHomeDirectory(customerPath)
      }
      NavigationService.navigate('MapView', {
        // 若未登录，则打开游客工作空间
        wsData: [
          {
            DSParams: { server: wsPath },
            // layerIndex: 0,
            type: 'Workspace',
          },
          ConstOnline['Google'],
        ],
        mapName: '外业采集',
        isExample: false,
      })
    },
  },
  // {
  //   key: '应急标绘',
  //   title: '应急标绘',
  //   baseImage: require('../assets/home/icon_lefttop_vip.png'),
  //   moduleImage: require('../assets/home/icon_plot.png'),
  // },
  // {
  //   key: '数据分析',
  //   title: '数据分析',
  //   baseImage: require('../assets/home/icon_rightbottom_vip.png'),
  //   moduleImage: require('../assets/home/icon_mapanalysis.png'),
  // },
]

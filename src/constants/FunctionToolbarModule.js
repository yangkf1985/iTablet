import { SMap } from 'imobile_for_reactnative'
import ConstOnline from './ConstOnline'
import ToolbarBtnType from '../containers/workspace/components/ToolBar/ToolbarBtnType'
import { ConstToolType } from '../constants'

function OpenData(data, index) {
  (async function() {
    if (GLOBAL.isArrayData) {
      await SMap.removeLayer(0)
    } else {
      await SMap.removeLayer(0)
      await SMap.removeLayer(0)
    }
    if (data instanceof Array) {
      await SMap.openDatasource(data[1].DSParams, index, false)
      await SMap.openDatasource(data[0].DSParams, index, false)
      GLOBAL.isArrayData = false
    } else {
      await SMap.openDatasource(data.DSParams, index, false)
      GLOBAL.isArrayData = true
    }
  }.bind(this)())
}

const layerAdd = [
  {
    title: '选择数据源',
    data: [
      {
        title: '选择目录',
      },
    ],
  },
]
const BotMap = [
  {
    title: 'Google',
    data: [
      {
        title: 'Google RoadMap',
        action: () => {
          OpenData(ConstOnline.Google, 0)
        },
      },
      {
        title: 'Google Staelite',
        action: () => {
          OpenData(ConstOnline.Google, 1)
        },
      },
      {
        title: 'Google Terrain',
        action: () => {
          OpenData(ConstOnline.Google, 2)
        },
      },
      {
        title: 'Google Hybrid',
        action: () => {
          OpenData(ConstOnline.Google, 3)
        },
      },
    ],
  },
  {
    title: 'MapWorld',
    data: [
      // {
      //   title: '全球矢量地图（经纬度）',
      //   action: () => {
      //     OpenData(ConstOnline.TDJWD,0)
      //   },
      // },
      {
        title: '全球矢量地图',
        action: () => {
          OpenData(ConstOnline.TD, 0)
        },
      },
      // {
      //   title: '全球影像地图服务（经纬度）',
      //   action: () => {
      //     OpenData(ConstOnline.TDYX,0)
      //   },
      // },
      {
        title: '全球影像地图服务',
        action: () => {
          OpenData(ConstOnline.TDYXM, 0)
        },
      },
      // {
      //   title: '全球地形晕渲地图服务（经纬度）',
      //   action: () => {
      //     OpenData(ConstOnline.TDQ,0)
      //   },
      // },
    ],
  },
  {
    title: 'Baidu',
    data: [
      {
        title: 'Baidu Map',
        action: () => {
          OpenData(ConstOnline.Baidu, 0)
        },
      },
    ],
  },
  {
    title: 'OSM',
    data: [
      {
        title: 'OSM Map',
        action: () => {
          OpenData(ConstOnline.OSM, 0)
        },
      },
    ],
  },
  {
    title: 'SuperMapCloud',
    data: [
      {
        title: 'quanguo',
        action: () => {
          OpenData(ConstOnline.SuperMapCloud, 0)
        },
      },
    ],
  },
]
const openData = [
  {
    title: '地图',
    data: [
      {
        title: '选择目录',
      },
    ],
  },
]

const line = [
  {
    key: '符号线',
    action: () => {
      GLOBAL.toolBox.menu()
      GLOBAL.toolBox.setState({
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          ToolbarBtnType.FLEX,
        ],
        selectKey: '符号线',
      })
      GLOBAL.toolBox.setVisible(true, ConstToolType.MAP_STYLE, {
        containerType: 'symbol',
        isFullScreen: false,
        column: 4,
        height: ConstToolType.THEME_HEIGHT[3],
      })
    },
    selectKey: '符号线',
  },
  {
    key: '线宽',
    action: () => {
      GLOBAL.toolBox.setState({
        isTouchProgress: true,
        isSelectlist: false,
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENUS,
          ToolbarBtnType.PLACEHOLDER,
        ],
        selectName: '线宽',
        selectKey: '线宽',
      })
    },
    selectKey: '线宽',
  },
  {
    key: '颜色',
    action: () => {
      GLOBAL.toolBox.menu()
      GLOBAL.toolBox.setState({
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          ToolbarBtnType.FLEX,
        ],
        selectKey: '线颜色',
      })
      GLOBAL.toolBox.setVisible(true, ConstToolType.LINECOLOR_SET, {
        containerType: 'colortable',
        column: 8,
        tableType: 'scroll',
        isFullScreen: false,
        height: ConstToolType.THEME_HEIGHT[3],
      })
    },
    selectKey: '线颜色',
  },
]

const point = [
  {
    key: '点符号',
    action: () => {
      GLOBAL.toolBox.menu()
      GLOBAL.toolBox.setState({
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          ToolbarBtnType.FLEX,
        ],
        selectKey: '点符号',
      })
      GLOBAL.toolBox.setVisible(true, ConstToolType.MAP_STYLE, {
        containerType: 'symbol',
        isFullScreen: false,
        column: 4,
        height: ConstToolType.THEME_HEIGHT[3],
      })
    },
    selectKey: '点符号',
  },
  {
    key: '大小',
    action: () => {
      GLOBAL.toolBox.setState({
        isTouchProgress: true,
        isSelectlist: false,
        selectName: '大小',
        selectKey: '大小',
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENUS,
          ToolbarBtnType.PLACEHOLDER,
        ],
      })
    },
    selectKey: '大小',
  },
  {
    key: '颜色',
    action: () => {
      GLOBAL.toolBox.menu()
      GLOBAL.toolBox.setState({
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          ToolbarBtnType.FLEX,
        ],
        selectKey: '点颜色',
      })
      GLOBAL.toolBox.setVisible(true, ConstToolType.POINTCOLOR_SET, {
        containerType: 'colortable',
        column: 8,
        tableType: 'scroll',
        isFullScreen: false,
        height: ConstToolType.THEME_HEIGHT[3],
      })
    },
    selectKey: '点颜色',
  },
  {
    key: '旋转角度',
    action: () => {
      GLOBAL.toolBox.setState({
        isTouchProgress: true,
        isSelectlist: false,
        selectName: '旋转角度',
        selectKey: '旋转角度',
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENUS,
          ToolbarBtnType.PLACEHOLDER,
        ],
      })
    },
    selectKey: '旋转角度',
  },
  {
    key: '透明度',
    action: () => {
      GLOBAL.toolBox.setState({
        isTouchProgress: true,
        isSelectlist: false,
        selectName: '透明度',
        selectKey: '点透明度',
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENUS,
          ToolbarBtnType.PLACEHOLDER,
        ],
      })
    },
    selectKey: '点透明度',
  },
]

const region = [
  {
    key: '面符号',
    action: () => {
      GLOBAL.toolBox.menu()
      GLOBAL.toolBox.setState({
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          ToolbarBtnType.FLEX,
        ],
        selectKey: '面符号',
      })
      GLOBAL.toolBox.setVisible(true, ConstToolType.MAP_STYLE, {
        containerType: 'symbol',
        isFullScreen: false,
        column: 4,
        height: ConstToolType.THEME_HEIGHT[3],
      })
    },
    selectKey: '面符号',
  },
  {
    key: '前景色',
    action: () => {
      GLOBAL.toolBox.menu()
      GLOBAL.toolBox.setState({
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          ToolbarBtnType.FLEX,
        ],
        selectKey: '前景色',
      })
      GLOBAL.toolBox.setVisible(true, ConstToolType.REGIONBEFORECOLOR_SET, {
        containerType: 'colortable',
        column: 8,
        tableType: 'scroll',
        isFullScreen: false,
        height: ConstToolType.THEME_HEIGHT[3],
      })
    },
    selectKey: '前景色',
  },
  {
    key: '背景色',
    action: () => {
      GLOBAL.toolBox.menu()
      GLOBAL.toolBox.setState({
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          ToolbarBtnType.FLEX,
        ],
        selectKey: '背景色',
      })
      GLOBAL.toolBox.setVisible(true, ConstToolType.REGIONAFTERCOLOR_SET, {
        containerType: 'colortable',
        column: 8,
        tableType: 'scroll',
        isFullScreen: false,
        height: ConstToolType.THEME_HEIGHT[3],
      })
    },
    selectKey: '背景色',
  },
  {
    key: '透明度',
    action: () => {
      GLOBAL.toolBox.setState({
        isTouchProgress: true,
        isSelectlist: false,
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENUS,
          ToolbarBtnType.PLACEHOLDER,
        ],
        selectName: '透明度',
        selectKey: '面透明度',
      })
    },
    selectKey: '面透明度',
  },
  // {
  //   key: '渐变',
  //   action: () => {
  //     GLOBAL.toolBox.setState({
  //       isTouchProgress: true,
  //       isSelectlist: false,
  //       buttons: [
  //         ToolbarBtnType.CANCEL,
  //         ToolbarBtnType.MENUS,
  //         ToolbarBtnType.PLACEHOLDER,
  //       ],
  //     })
  //   },
  // },
]

const grid = [
  {
    key: '透明度',
    action: () => {
      GLOBAL.toolBox.setState({
        isTouchProgress: true,
        isSelectlist: false,
        selectName: '透明度',
        selectKey: '栅格透明度',
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENUS,
          ToolbarBtnType.PLACEHOLDER,
        ],
      })
    },
    selectKey: '栅格透明度',
  },
  {
    key: '对比度',
    action: () => {
      GLOBAL.toolBox.setState({
        isTouchProgress: true,
        isSelectlist: false,
        selectName: '对比度',
        selectKey: '栅格对比度',
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENUS,
          ToolbarBtnType.PLACEHOLDER,
        ],
      })
    },
    selectKey: '栅格对比度',
  },
  {
    key: '亮度',
    action: () => {
      GLOBAL.toolBox.setState({
        isTouchProgress: true,
        isSelectlist: false,
        selectName: '亮度',
        selectKey: '栅格亮度',
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENUS,
          ToolbarBtnType.PLACEHOLDER,
        ],
      })
    },
    selectKey: '栅格亮度',
  },
]
export { layerAdd, BotMap, openData, line, point, region, grid }

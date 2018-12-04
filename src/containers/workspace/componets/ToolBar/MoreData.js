/**
 * 获取地图更多
 */
import { ConstToolType } from '../../../../constants'
import constants from '../../constants'

let _params = {}

function getMapMore(type, params) {
  let data = [],
    buttons = []
  _params = params
  if (type !== ConstToolType.MAP_MORE) return { data, buttons }
  data = [
    {
      key: constants.CLOSE,
      title: constants.CLOSE,
      action: closeMap,
      size: 'large',
      image: require('../../../../assets/mapTools/icon_point.png'),
      selectedImage: require('../../../../assets/mapTools/icon_point.png'),
    },
    {
      key: constants.SAVE,
      title: constants.SAVE,
      size: 'large',
      // TODO 保存地图
      action: () => saveMap('TempMap'),
      image: require('../../../../assets/mapTools/icon_words.png'),
      selectedImage: require('../../../../assets/mapTools/icon_words.png'),
    },
    {
      key: constants.SAVE_AS,
      title: constants.SAVE_AS,
      size: 'large',
      action: saveMapAs,
      image: require('../../../../assets/mapTools/icon_point_line.png'),
      selectedImage: require('../../../../assets/mapTools/icon_point_line.png'),
    },
    {
      key: constants.SHARE,
      title: constants.SHARE,
      size: 'large',
      action: shareMap,
      image: require('../../../../assets/mapTools/icon_free_line.png'),
      selectedImage: require('../../../../assets/mapTools/icon_free_line.png'),
    },
  ]
  return { data, buttons }
}

/*******************************************操作分割线*********************************************/

/** 关闭地图 **/
function closeMap() {
  // return SMap.setAction(Action.PATCH_HOLLOW_REGION)
}

/** 保存地图 **/
function saveMap() {
  if (!_params.setSaveViewVisible) return
  _params.setSaveViewVisible(true)
}

/** 另存地图 **/
function saveMapAs() {
  if (!_params.setSaveMapDialogVisible) return
  _params.setSaveMapDialogVisible(true)
}

/** 分享 **/
function shareMap() {
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)

  _params.setToolbarVisible(true, ConstToolType.MAP_SHARE, {
    containerType: 'table',
    column: 4,
    isFullScreen: true,
    height: ConstToolType.HEIGHT[0],
  })
}

export default {
  getMapMore,
}

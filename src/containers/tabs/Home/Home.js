import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  AsyncStorage,
} from 'react-native'
import { Container } from '../../../components'
import { ModuleList } from './components'
import styles from './styles'
import Toast from '../../../utils/Toast'
import { SScene } from 'imobile_for_reactnative'
import FileTools from '../../../native/FileTools'
// import Orientation from '../../../constants/Orientation'
export default class Home extends Component {
  props: {
    nav: Object,
    latestMap: Object,
    currentUser: Object,
    setShow: () => {},
    device: Object,
    // map3DleadWorkspace: () => {},
    improtSceneWorkspace: () => {},
    importWorkspace: () => {},
  }

  constructor(props) {
    super(props)
  }

  /**
   * 深度遍历fullFileDir目录下的fileType数据
   * fullFileDir 文件目录
   * fileType 文件类型 {smwu:'smwu',sxwu:'sxwu',sxw:'sxw',smw:'smw',udb:'udb'}
   * arrFilterFile 添加到arrFilterFile数组中保存
   * */
  _setFilterDatas = async (fullFileDir, fileType, arrFilterFile) => {
    try {
      let isRecordFile = false
      let arrDirContent = await FileTools.getDirectoryContent(fullFileDir)
      for (let i = 0; i < arrDirContent.length; i++) {
        let fileContent = arrDirContent[i]
        let isFile = fileContent.type
        let fileName = fileContent.name
        let newPath = fullFileDir + '/' + fileName
        if (isFile === 'file' && !isRecordFile) {
          if (
            (fileType.smwu && fileName.indexOf(fileType.smwu) !== -1) ||
            (fileType.sxwu && fileName.indexOf(fileType.sxwu) !== -1) ||
            (fileType.sxw && fileName.indexOf(fileType.sxw) !== -1) ||
            (fileType.smw && fileName.indexOf(fileType.smw) !== -1) ||
            (fileType.udb && fileName.indexOf(fileType.udb) !== -1)
          ) {
            if (
              !(
                fileName.indexOf('~[') !== -1 &&
                fileName.indexOf(']') !== -1 &&
                fileName.indexOf('@') !== -1
              )
            ) {
              fileName = fileName.substring(0, fileName.length - 5)
              arrFilterFile.push({
                filePath: newPath,
                fileName: fileName,
                directory: fullFileDir,
              })
              isRecordFile = true
            }
          }
        } else if (isFile === 'directory') {
          await this._setFilterDatas(newPath, fileType, arrFilterFile)
        }
      }
    } catch (e) {
      Toast.show('没有数据')
    }
    return arrFilterFile
  }
  _onImportWorkspace = async (zipFilePath, currentModuleKey, item) => {
    try {
      if (zipFilePath !== undefined) {
        let fileDirPath = zipFilePath.substring(0, zipFilePath.length - 4)
        // console.warn(`filePath:${zipFilePath},savePath${fileDirPath}`)
        let unFileZipResult = await FileTools.unZipFile(
          zipFilePath,
          fileDirPath,
        )
        if (!unFileZipResult) {
          FileTools.deleteFile(fileDirPath)
          return
        }
        let arrFilePath = []
        await FileTools.getFilterFiles(
          fileDirPath,
          { smwu: 'smwu', sxwu: 'sxwu' },
          arrFilePath,
        )
        let filePath = arrFilePath[0].filePath
        if (
          this.props.currentUser.userName &&
          currentModuleKey.indexOf(this.props.currentUser.userName) === -1
        ) {
          currentModuleKey = this.props.currentUser.userName + item.key
        }
        let is3D = await SScene.is3DWorkspace({ server: filePath })
        if (is3D === true) {
          let result = await SScene.import3DWorkspace({ server: filePath })
          if (result === true) {
            AsyncStorage.setItem(currentModuleKey, true)
            Toast.show('导入3D成功')
          } else {
            Toast.show('导入3D失败')
          }
        } else {
          let result = await this.props.importWorkspace({ path: filePath })
          // console.warn(result)
          if (result.msg !== undefined) {
            Toast.show('导入失败')
          } else {
            AsyncStorage.setItem(currentModuleKey, currentModuleKey)
            // item.action && item.action(this.props.currentUser)
            Toast.show('导入成功')
          }
        }
      }
    } catch (e) {
      Toast.show('导入失败')
    } finally {
      let fileDirPath = zipFilePath.substring(0, zipFilePath.length - 4)
      FileTools.deleteFile(fileDirPath)
    }
  }
  headRender() {
    let userImg = require('../../../assets/home/icon_mine_select.png')
    let moreImg = require('../../../assets/home/icon_else_selected.png')
    const title = 'SuperMap iTablet'
    return (
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.userView} onPress={async () => {}}>
          <Image source={userImg} style={styles.userImg} />
        </TouchableOpacity>
        <Text style={styles.headTitle}>{title}</Text>
        <TouchableOpacity style={styles.moreImg}>
          <Image
            resizeMode={'contain'}
            source={moreImg}
            style={styles.moreImg}
          />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
      </View>
    )
  }

  render() {
    let userImg = require('../../../assets/home/icon_mine_select.png')
    let moreImg = require('../../../assets/home/icon_else_selected.png')
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: 'SuperMap iTablet',
          headerLeft: (
            <TouchableOpacity
              style={styles.userView}
              onPress={() => {
                // this.props.map3DleadWorkspace({
                //   path:
                //     '/storage/emulated/0/iTablet/Common/OlympicGreen_android.zip',
                // })
              }}
            >
              <Image source={userImg} style={styles.userImg} />
            </TouchableOpacity>
          ),
          headerRight: (
            <TouchableOpacity style={styles.moreImg}>
              <Image
                resizeMode={'contain'}
                source={moreImg}
                style={styles.moreImg}
              />
            </TouchableOpacity>
          ),
          headerStyle: {
            height: 60 + (Platform.OS === 'ios' ? 10 : 0),
          },
        }}
        style={styles.container}
      >
        {/*{this.headRender()}*/}
        <View
          style={{
            flex: 1,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ModuleList
            importWorkspace={this._onImportWorkspace}
            currentUser={this.props.currentUser}
            styles={styles.modulelist}
            device={this.props.device}
          />
        </View>
      </Container>
    )
  }
}

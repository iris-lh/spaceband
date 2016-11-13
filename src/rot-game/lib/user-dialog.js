const dialog = require('electron').remote.dialog
import jetpack          from 'fs-jetpack'
import { FileManager }  from './file-manager'
var fm = FileManager

export var UserDialog = {
  chooseLevel() {
    return dialog.showOpenDialog({
      title:       'Load Level',
      properties:  ['openFile'],
      defaultPath: fm.assetsPath()+'/levels/',
      filters:     [{name: 'YAML Files', extensions: ['yml']}]
    })[0]
  },

  chooseSaveGamePath() {
    return dialog.showSaveDialog({
      title:       'Save Game',
      defaultPath: fm.appPath()+'/saves/',
      filters:     [{name: 'JSON Files', extensions: ['json']}]
    })
  },

  chooseLoadGamePath() {
    return dialog.showOpenDialog({
      title:       'Load Game',
      properties:  ['openFile'],
      defaultPath: fm.appPath()+'/saves/',
      filters:     [{name: 'JSON Files', extensions: ['json']}]
    })[0]
  },
}

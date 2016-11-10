const dialog = require('electron').remote.dialog
import jetpack from 'fs-jetpack'



export var UserDialog = {
  chooseLevel() {
    return dialog.showOpenDialog({
      title:       'Load Level',
      properties:  ['openFile'],
      defaultPath: jetpack.cwd()+'/app/assets/levels/',
      filters:     [{name: 'YAML Files', extensions: ['yml']}]
    })[0]
  },

  chooseSaveGamePath() {
    return dialog.showSaveDialog({
      title:       'Save Game',
      defaultPath: jetpack.cwd()+'/app/saves/',
      filters:     [{name: 'JSON Files', extensions: ['json']}]
    })
  },

  chooseLoadGamePath() {
    return dialog.showOpenDialog({
      title:       'Load Game',
      properties:  ['openFile'],
      defaultPath: jetpack.cwd()+'/app/saves/',
      filters:     [{name: 'JSON Files', extensions: ['json']}]
    })[0]
  },
}

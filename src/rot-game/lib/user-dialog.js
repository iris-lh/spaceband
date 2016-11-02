const dialog = require('electron').remote.dialog
import jetpack from 'fs-jetpack'



export var UserDialog = {
  chooseLevel() {
    return dialog.showOpenDialog({
      properties: ['openFile'],
      defaultPath: jetpack.cwd()+'/src/rot-game/assets/levels/'
    })[0]
  }
}

const dialog = require('electron').remote.dialog



export var UserDialog = {
  chooseLevel() {
    return dialog.showOpenDialog({properties: ['openFile']})[0]
  }
}

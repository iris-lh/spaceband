import _ from 'lodash'
import { ROT } from './rot'
import { tiles } from './tiles'
import { Actor } from './actor'



export class Player extends Actor {

  act() {
    this._game.engine.lock()
    window.addEventListener('keydown', this)
  }

  _processTurn(dx, dy) {
    var newCoords = [ this._x + dx, this._y + dy ]

    if (newCoords in this._game.map) {
      // move!
      this._x += dx
      this._y += dy
      this._game.camera.x -= dx
      this._game.camera.y -= dy

      // post move cleanup
      window.removeEventListener('keydown', this)
      this._game.engine.unlock()
    }
  }

  _checkBox(box) {
    var key = this._x + ',' + this._y
    if (this._game.map[key].char != box) {
      alert('There is no box here!')
    } else if (key == this._game.ananas) {
      alert('Hooray! You found the ananas and won this game.')
      this._game.engine.lock()
      window.removeEventListener('keydown', this)
    } else {
      alert('This box is empty :-(')
    }
  }

  handleEvent(e) {
    var code = e.keyCode
    if (_.includes(this._keyMap.checkBoxKeys, code)) {
      this._checkBox(tiles.box.char)
      return
    }

    /* one of numpad directions? */
    if (!(code in this._keyMap.dirs)) { return }

    /* is there a free space? */
    var dir = ROT.DIRS[8][this._keyMap.dirs[code]]

    this._processTurn(dir[0], dir[1])
  }
}

Player.prototype._keyMap = {
  dirs: {
           [ROT.VK_UP]: 0,
      [ROT.VK_PAGE_UP]: 1,
        [ROT.VK_RIGHT]: 2,
    [ROT.VK_PAGE_DOWN]: 3,
         [ROT.VK_DOWN]: 4,
          [ROT.VK_END]: 5,
         [ROT.VK_LEFT]: 6,
         [ROT.VK_HOME]: 7
  },
  checkBoxKeys: [
    ROT.VK_RETURN,
    ROT.VK_SPACE
  ]
}

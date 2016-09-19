import _ from 'lodash'
import { ROT } from './vendor/rot'
import { tiles } from './tiles'
import { Actor } from './actor'



export class Player extends Actor {

  act() {
    //this._game.engine.lock()
    //window.addEventListener('keydown', this)
  }

  _processTurn(dx, dy) {
    var newCoords = [ this.x + dx, this.y + dy ]

    if (newCoords in this._game.map) {
      // move!
      this.x += dx
      this.y += dy
      this._game.camera.x -= dx
      this._game.camera.y -= dy

      // post move cleanup
      //window.removeEventListener('keydown', this)
      //this._game.engine.unlock()
    }
  }

  _checkBox(box) {
    var key = this.x + ',' + this.y
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

  /*
  handleEvent(e) {
    var code = e.keyCode
    if (_.includes(this._game.keyMap.checkBoxKeys, code)) {
      this._checkBox(tiles.box.char)
      return
    }

    // one of numpad directions?
    if (!(code in this._game.keyMap.dirs)) { return }

    // is there a free space?
    var dir = ROT.DIRS[8][this._game.keyMap.dirs[code]]

    this._processTurn(dir[0], dir[1])
    this.dx = dir[0]
    this.dy = dir[1]

    console.log(this.dx, this.dy)
  }
  */
}

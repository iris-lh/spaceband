import { ROT } from './rot'
import { cfg } from './config'
import { tiles } from './tiles'

export var Player = function(game, tile, x, y) {
  this._game = game
  this._tile = tile
  this._x = x
  this._y = y
  this._keyMap = {
    38: 0,
    33: 1,
    39: 2,
    34: 3,
    40: 4,
    35: 5,
    37: 6,
    36: 7
  }

  this._draw()
}

Player.prototype.getX = function() { return this._x }
Player.prototype.getY = function() { return this._y }

Player.prototype.act = function() {
  this._game.engine.lock()
  window.addEventListener('keydown', this)
}

Player.prototype.handleEvent = function(e) {
  var code = e.keyCode
  if (code == 13 || code == 32) {
      this._checkBox()
      return
  }

  /* one of numpad directions? */
  if (!(code in this._keyMap)) { return }

  /* is there a free space? */
  var dir = ROT.DIRS[8][this._keyMap[code]]
  var nextStep = [ this._x + dir[0], this._y + dir[1] ]
  var newKey = nextStep[0] + ',' + nextStep[1]
  if (newKey in this._game.map) {

    // redraw floor
    this._game.drawTile(this._x, this._y, this._game.map[this._x + ',' + this._y])

    // move!
    this._x = nextStep[0]
    this._y = nextStep[1]

    this._draw()

    // post move cleanup
    window.removeEventListener('keydown', this)
    this._game.engine.unlock()
  }
}

Player.prototype._draw = function() {
  this._game.drawTile(this._x, this._y, this._tile)
}

Player.prototype._checkBox = function() {
  var key = this._x + ',' + this._y
  if (this._game.map[key].char != tiles.box.char) {
    alert('There is no box here!')
  } else if (key == this._game.ananas) {
    alert('Hooray! You found an ananas and won this game.')
    this._game.engine.lock()
    window.removeEventListener('keydown', this)
  } else {
    alert('This box is empty :-(')
  }
}

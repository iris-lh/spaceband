import { ROT } from './rot'
import { cfg } from './config'
import { tiles } from './tiles'

export var Player = function(game, x, y) {
  this._game = game
  this._x = x
  this._y = y
  this._draw()
}

Player.prototype.getSpeed = function() { return 100 }
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

  var keyMap = {}
  keyMap[38] = 0
  keyMap[33] = 1
  keyMap[39] = 2
  keyMap[34] = 3
  keyMap[40] = 4
  keyMap[35] = 5
  keyMap[37] = 6
  keyMap[36] = 7

  /* one of numpad directions? */
  if (!(code in keyMap)) { return }

  /* is there a free space? */
  var dir = ROT.DIRS[8][keyMap[code]]
  var newX = this._x + dir[0]
  var newY = this._y + dir[1]
  var newKey = newX + ',' + newY
  if (!(newKey in this._game.map)) { return }

  //put the floor back where it was
  var coordinates = this._x + ',' + this._y
  if (this._game.map[coordinates] == cfg.boxChar) {
    this._game._drawTile(this._x, this._y, this._game.map[coordinates])
  } else {
    this._game._drawTile(this._x, this._y, this._game.map[coordinates])
  }

  this._x = newX
  this._y = newY
  this._draw()
  window.removeEventListener('keydown', this)
  this._game.engine.unlock()
}

Player.prototype._draw = function() {
  this._game._drawTile(this._x, this._y, tiles.player)
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

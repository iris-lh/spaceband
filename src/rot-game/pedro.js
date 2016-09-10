import { cfg } from './config'
import { tiles } from './tiles'

export var Pedro = function(game, x, y) {
  this._game = game
  this._x = x
  this._y = y
  this._draw()
}

Pedro.prototype.getSpeed = function() { return 100 }

Pedro.prototype.act = function() {
  var game = this._game
  var x = game.player.getX()
  var y = game.player.getY()

  var passableCallback = function(x, y) {
      return (x+','+y in game.map)
  }
  var pather = new cfg.pedroPathAlg(x, y, passableCallback, {topology:cfg.pedroTopology})

  var path = []
  var pathCallback = function(x, y) {
      path.push([x, y])
  }
  pather.compute(this._x, this._y, pathCallback)

  path.shift()
  if (path.length <= 1) {
    this._draw()
    game.engine.lock()
    alert('Game over - you were captured by Pedro!')
  } else {
    x = path[0][0]
    y = path[0][1]

    //put the floor back where it was
    var coordinates = this._x + ',' + this._y
    if (game.map[coordinates].char == tiles.box.char) {
      game._drawTile(this._x, this._y, game.map[coordinates])
    } else {
      game._drawTile(this._x, this._y, game.map[coordinates])
    }

    this._x = x
    this._y = y
    this._draw()
  }
}

Pedro.prototype._draw = function() {
  this._game._drawTile(this._x, this._y, tiles.pedro)
}

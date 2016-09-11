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
  var path = this._computePathToPlayer(game, cfg.pedroPathAlg, cfg.pedroTopology);

  if (path.length > 2) {
    // redraw floor
    game._drawTile(this._x, this._y, game.map[this._x + ',' + this._y])

    // move!
    this._x = path[0][0]
    this._y = path[0][1]
  }

  this._draw()

  if (path.length <= 1) {
    game.engine.lock()
    alert('Game over - you were captured by Pedro!')
  }
}

Pedro.prototype._computePathToPlayer = function(game, algorithm, topology) {
  var playerX = game.player.getX()
  var playerY = game.player.getY()

  var passableCallback = function(targetX, targetY) {
      return (targetX+','+targetY in game.map)
  }
  var pathingAlgorithm = new algorithm(playerX, playerY, passableCallback, { topology: topology })

  var path = []
  pathingAlgorithm.compute(this._x, this._y, function(x, y) {
      path.push([x, y])
  })

  path.shift()

  return path
}

Pedro.prototype._draw = function() {
  this._game._drawTile(this._x, this._y, tiles.pedro)
}

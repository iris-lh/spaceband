import { cfg } from './config'

export var Pedro = function(game, tile, x, y) {
  this._game = game
  this._tile = tile
  this._x = x
  this._y = y

  this._draw()
}

Pedro.prototype.act = function() {
  var game = this._game
  var path = this._computePathToPlayer(game, cfg.pedroPathAlg, cfg.pedroTopology);
  var nextStep = path[0]

  if (path.length >= 2) {
    // redraw floor
    game.drawTile(this._x, this._y, game.map[this._x + ',' + this._y])

    // move!
    this._x = nextStep[0]
    this._y = nextStep[1]

    this._draw()

    // post move cleanup (non needed)
  } else {
    game.engine.lock()
    alert('Game over - you were captured by Pedro!')
  }
}

Pedro.prototype._computePathToPlayer = function(game, algorithm, topology) {
  var playerX = game.player.getX()
  var playerY = game.player.getY()
  var path = []

  var passableCallback = function(targetX, targetY) {
      return (targetX+','+targetY in game.map)
  }
  var pathingAlgorithm = new algorithm(playerX, playerY, passableCallback, { topology: topology })

  pathingAlgorithm.compute(this._x, this._y, function(x, y) {
      path.push([x, y])
  })

  path.shift()

  return path
}

Pedro.prototype._draw = function() {
  this._game.drawTile(this._x, this._y, this._tile)
}

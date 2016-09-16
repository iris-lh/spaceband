import { cfg } from './config'
import { Actor } from './actor'

export class Bandito extends Actor {

  constructor(game, tile, x, y) {
    super(game, tile, x, y)
    this._target = game.player
  }

  _processTurn() {
    var game = this._game
    var path = this._computePathTo(game.map, this._target, cfg.pedroPathAlg, cfg.pedroTopology)
    var nextStep = path[0]

    if (path.length >= 2) {
      // redraw floor
      game.drawTile(this._x, this._y, game.map[this._x + ',' + this._y])

      // move!
      this._x = nextStep[0]
      this._y = nextStep[1]

      // post move cleanup (non needed)
    } else {
      game.engine.lock()
      alert('Game over - you were captured by '+this._tile.name+'!')
    }
  }

  _computePathTo(map, target, algorithm, topology) {
    var path = []

    var passableCallback = function(targetX, targetY) {
        return (targetX+','+targetY in map)
    }
    var pathingAlgorithm = new algorithm(
      target._x, target._y,
      passableCallback,
      { topology: topology })

    pathingAlgorithm.compute(this._x, this._y, function(x, y) {
        path.push([x, y])
    })

    path.shift()

    return path
  }
}

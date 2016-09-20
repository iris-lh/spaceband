import { cfg } from './config'
import { Actor } from './actor'



export class Bandito extends Actor {
/*
  _processTurn() {
    var game = this._game
    var path = this._computePathTo(game.map, this._target, cfg.pedroPathAlg, cfg.pedroTopology)
    var nextStep = path[0]

    if (path.length >= 2) {
      // move!
      this.x = nextStep[0]
      this.y = nextStep[1]

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
      target.x, target.y,
      passableCallback,
      { topology: topology })

    pathingAlgorithm.compute(this.x, this.y, function(x, y) {
        path.push([x, y])
    })

    path.shift()

    return path
  }
  */
}

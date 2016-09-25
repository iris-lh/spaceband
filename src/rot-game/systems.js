import { ROT } from './vendor/rot'
import { cfg } from './config'
import { tiles } from './tiles'
import { _ } from 'lodash'

export class Systems {

  constructor(scene, view) {
    this.scene = scene
    this.view  = view
  }


  act() {
    this.engine.lock()
    window.addEventListener('keydown', this)

    this._computePaths()
    this._moveEntities()
    this.view.render()
  }


  handleEvent(e) {
    var code = e.keyCode

    if (_.includes(cfg.keyMap.checkBoxKeys, code)) {
      this._checkBox(tiles.box.char)
      return
    }

    if ((code in cfg.keyMap.dirs)) {
      var dir = ROT.DIRS[8][cfg.keyMap.dirs[code]]
      this.scene.player.dx = dir[0]
      this.scene.player.dy = dir[1]
    }

    window.removeEventListener('keydown', this)
    this.engine.unlock()
  }


  _checkBox(box) {
    var key = this.scene.player.x + ',' + this.scene.player.y
    if (this.scene.map[key].char != box) {
      alert('There is no box here!')
    } else if (key == this.scene.ananas) {
      alert('Hooray! You found the ananas and won this game.')
      this.engine.lock()
      window.removeEventListener('keydown', this)
    } else {
      alert('This box is empty :-(')
    }
  }


  _moveEntities() {
    console.log('systems._moveEntities entities:',this.scene.entities())
    this.scene.entities().forEach((entity) => {
      if (entity.isEntity) {

        var newCoords = [ entity.x + entity.dx, entity.y + entity.dy ]

        if (newCoords in this.scene.map) {
          entity.x += entity.dx
          entity.y += entity.dy
        }

        entity.dx = 0
        entity.dy = 0
      }
    })
  }


  _computePaths() {
    var entities = this.scene.entities()
    for (var ent in entities) {
      var entity = entities[ent]
      if (entity.isEntity && entity.pathAlg && entity.target) {
        var path = []

        var scene = this.scene
        var passableCallback = function(targetX, targetY) {
            return scene.map[targetX+','+targetY]
        }
        var pathingAlgorithm = new entity.pathAlg(
          entity.target.x,
          entity.target.y,
          passableCallback,
          { topology: entity.topology }
        )

        pathingAlgorithm.compute(entity.x, entity.y, function(x, y) {
            path.push([x, y])
        })

        path.shift()

        if (path.length >= 2) {
          entity.dx = path[0][0] - entity.x
          entity.dy = path[0][1] - entity.y
        } else {
          alert('Game Over!')
          this.engine.lock()
        }
      }
    }
  }

}

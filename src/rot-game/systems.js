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
      this._checkBox(this.scene.tiles.box.char)
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
    this.scene.entities().forEach( (entity)=> {
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

  _fetchTarget(target) {
    var entities = this.scene.entities()
    for (var ent in entities) {
      var entity = entities[ent]
      if (entity.type == target) {
        var coords = {x:entity.x, y:entity.y}
        return coords
      }
    }
  }

  _computePaths() {
    var entities = this.scene.entities()
    for (var ent in entities) {
      var entity = entities[ent]
      if (entity.target) {
        var asdf = this._fetchTarget(entity.target)

        var path = []

        var scene = this.scene
        var passableCallback = (targetX, targetY)=> {
          return scene.map[targetX+','+targetY]
        }
        var pathingAlgorithm = new ROT.Path.Dijkstra(
          asdf.x,
          asdf.y,
          passableCallback,
          { topology: 4 }
        )

        pathingAlgorithm.compute(
          entity.x,
          entity.y,
          (x, y) => { path.push([x, y]) }
        )

        path.shift()

        if (path.length >= 2) {
          entity.dx = path[0][0] - entity.x
          entity.dy = path[0][1] - entity.y
        } else if (path) {
           alert('Game Over! You were caught by '+entity.name+'.')
           this.engine.lock()
        }
      }
    }
  }


}

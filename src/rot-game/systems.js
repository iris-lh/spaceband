import { ROT } from './vendor/rot'
import { cfg } from './config'
import { _ } from 'lodash'
var flatten = require('flat')

export class Systems {

  constructor(scene, view) {
    this.scene = scene
    this.view  = view
    this.gameIsOver = false
  }


  act() {
    this.engine.lock()
    window.addEventListener('keydown', this)

    this._computePaths()
    if (!this.gameIsOver) {
      this._moveEntities()
    }
    this.view.render()
  }


  handleEvent(e) {
    var code = e.keyCode

    if (!_.includes(flatten(cfg.keyMap), code)) {
      return
    }

    if (_.includes(cfg.keyMap.checkBoxKeys, code)) {
      this._checkBox(this.scene.tiles.box.char)
      return
    }

    if (_.includes(cfg.keyMap.dirs, code)) {
      var dir = ROT.DIRS[8][_.indexOf(cfg.keyMap.dirs, code)]
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
      this.gameIsOver = true
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

  _killEntity(entity) {
    this.scene._entities.pop(entity)
  }

  _fetchEntity(id) {
    for (var entity in this.scene.entities()) {
      if (id == entity.id) {return entity}
    }
  }

  _fetchTarget(target) {
    var entities = this.scene.entities()
    for (var ent in entities) {
      var entity = entities[ent]
      if (entity.type == target) {
        var coords = {x:entity.x, y:entity.y, id:entity.id}
        return coords
      }
    }
  }


  _computePaths() {
    var entities = this.scene.entities()
    for (var ent in entities) {
      var entity = entities[ent]
      if (entity.target) {
        var target = this._fetchTarget(entity.target)
        if (target) {

          var path = []

          var scene = this.scene
          var passableCallback = (targetX, targetY)=> {
            return scene.map[targetX+','+targetY]
          }
          var pathingAlgorithm = new ROT.Path.Dijkstra(
            target.x,
            target.y,
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

            if (entity.type == 'lawman') {
              this._killEntity(this._fetchEntity(target.id))
              alert('Huzzah! Law-man '+entity.name+' has killed a bandito.')
            } else if (entity.type == 'bandito') {
              this.gameIsOver = true
              alert('Game Over! You were caught by '+entity.name+'.')
              this.engine.lock()
            }
          }
        }
      }
    }
  }


}

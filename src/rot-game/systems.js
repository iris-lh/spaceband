import { ROT } from './vendor/rot'
import { cfg } from './config'
import { _ } from 'lodash'
var flatten = require('flat')

export class Systems {

  constructor(scene, view) {
    this.scene = scene
    this.view  = view
    this.turn  = 0
    this.alertMessage = ''
    this.playerCaught = {by:null}
    this.gameIsOver = false
    if (this.scene.entities('bandito').length > 0) {
      this.banditoThreat = true
    } else {
      this.banditoThreat = false
    }

  }


  act() {
    this.engine.lock()
    this.turn += 1
    window.addEventListener('keydown', this)

    if (!this.gameIsOver) {
      this._computePaths()
      this._moveEntities()
    }

    this._checkIfGameIsOver()
    this.view.render()
  }

  _checkIfGameIsOver() {
    var gameOver

    // all banditos have been killed
    if (this.banditoThreat && this.scene.entities('bandito').length == 0) {
      this.banditoThreat = false
      this.view.addMessage('All banditos are in jail.', this.turn)
      this.view.addMessage('"All in a days work, pardner."', this.turn)

    // player has found ananas
    } else if (this.scene.player.hasAnanas) {
      gameOver = true
      this.view.addMessage('Hooray! You found the ananas and won this game.', this.turn)

    // a bandito has caught the player
    } else if (this.playerCaught.by) {
      gameOver = true
      var captor = this.playerCaught.by
      var fg = captor.fg
      this.view.addMessage('Game Over! You were caught by '+captor.name+'.', this.turn)
    }

    if (gameOver) {
      this.gameIsOver = true
      window.removeEventListener('keydown', this)
      this.engine.lock()
    }
  }



  handleEvent(e) {
    var code = e.keyCode

    if (!_.includes(flatten(cfg.keyMap), code)) {
      return
    }

    if (_.includes(cfg.keyMap.checkBoxKeys, code)) {
      this._checkBox(this.scene.tiles.box.char)
      if (!this.scene.player.hasAnanas) {return}
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
      this.view.addMessage('There is no box here!', this.turn, true)
    } else if (key == this.scene.ananas) {
      this.scene.player.hasAnanas = true
    } else {
      this.view.addMessage('This box is empty :-(', this.turn, true)
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
    this.scene._entities = _.without(this.scene._entities, entity)
  }

  _fetchEntity(target) {
    var entities = this.scene.entities(target.type)
    for (var ent in entities) {
      var entity = entities[ent]
      if (target.id == entity.id) {return entity}
    }
  }

  _fetchTarget(targetType) {
    var entities = this.scene.entities(targetType)
    for (var ent in entities) {
      var entity = entities[ent]
      if (entity.type == targetType) {
        return {x:entity.x, y:entity.y, id:entity.id, name:entity.name}
      }
    }
  }

  _fetchClosestTarget(seeker) {
    var entities = this.scene.entities(seeker.target)
    if (entities.length == 0) {return}
    var closest = entities[0]
    for (var ent in entities) {
      var entity = entities[ent]
      var distance = this._hypoteneuse(
        Math.abs(closest.x - seeker.x),
        Math.abs(closest.y - seeker.y)
      )

      if (
        entity.type == seeker.target &&
        this._hypoteneuse(
          Math.abs(entity.x - seeker.x),
          Math.abs(entity.y - seeker.y)
        ) < distance
      ) {
        closest = {x:entity.x, y:entity.y, id:entity.id, name:entity.name}
      }
    }
    return closest
  }

  _hypoteneuse(a, b) {
    var c2 = a*a + b*b
    return Math.sqrt(c2)
  }


  _computePaths() {
    var entities = this.scene.entities()
    for (var ent in entities) {
      var entity = entities[ent]
      if (entity.target) {
        var target = this._fetchClosestTarget(entity)
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
            { topology: entity.topology||4 }
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
              var victim = this._fetchEntity(target)
              this._killEntity(victim)
              this.view.addMessage(
                'Law-man '+entity.name+' has arrested bandito '+victim.name+'.',
                this.turn
              )
            } else if (entity.type == 'bandito') {
              this.playerCaught.by = this._fetchEntity(entity)
            }
          }
        }
      }
    }
  }


}

import { ROT } from './vendor/rot'
import { cfg } from './config'
import { tiles } from './tiles'
import { _ } from 'lodash'

export class Systems {

  act() {
    this.engine.lock()
    window.addEventListener('keydown', this)

    this.computePaths()
    this.moveEntities()
    this.scene.camera.update()
    this.render()
  }

  handleEvent(e) {
    var code = e.keyCode

    if (_.includes(cfg.keyMap.checkBoxKeys, code)) {
      this.checkBox(tiles.box.char)
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



  checkBox(box) {
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



  moveEntities() {
    var self = this
    this.scene.entities().forEach(function(entity) {
      if (entity.isEntity) {

        var newCoords = [ entity.x + entity.dx, entity.y + entity.dy ]

        if (newCoords in self.scene.map) {
          entity.x += entity.dx
          entity.y += entity.dy
        }

        entity.dx = 0
        entity.dy = 0
      }
    })
  }



  computePaths() {
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


  //eventually move to 'view'
  drawEntities() {
    var self = this
    var scene = this.scene
    var entities = this.scene.entities()
    console.log('entities:',entities)
    entities.forEach(function(entity) {
      self.drawTile(
        entity.x + scene.camera.x,
        entity.y + scene.camera.y,
        entity.tile
      )
    })
  }


  //eventually move to 'view'
  drawTile(x, y, tile) {
    this.display.draw(x, y, tile.char, tile.fg, tile.bg)
  }


  //eventually move to 'sceneBuilder'
  generateMap() {
    var digger = new ROT.Map.Digger(
      cfg.mapWidth,
      cfg.mapHeight,
      {
        roomWidth:[3,7],
        roomHeight:[3,7],
        dugPercentage:0.3
      }
    )
    var digCallback = function(x, y, value) {
      if (value) { return }

      var coords = x+','+y
      this.scene.map[coords] = tiles.floor
      this.scene.map.freeCells.push(coords)
    }
    digger.create(digCallback.bind(this))

    this.generateBoxes(this.scene.map.freeCells)
  }


  //eventually move to 'sceneBuilder'
  createActor(what, tile, type, target=null) {
    var index = Math.floor(ROT.RNG.getUniform() * this.scene.map.freeCells.length)
    var coords = this.scene.map.freeCells.splice(index, 1)[0]
    var parts = coords.split(',')
    var x = parseInt(parts[0])
    var y = parseInt(parts[1])

    var entity = new what(this, tile, type, x, y, target)

    return entity
  }


  //eventually move to 'sceneBuilder'
  generateBoxes(freeCells) {
    for (var i=0;i<cfg.numOfBoxes;i++) {
      var index = Math.floor(ROT.RNG.getUniform() * this.scene.map.freeCells.length)
      var coords = this.scene.map.freeCells.splice(index, 1)[0]
      this.scene.map[coords] = tiles.box
      if (!i) { this.scene.ananas = coords } /* first box contains the ananas */
    }
  }


  //eventually move to 'view'
  render() {
    this.display.clear()
    for (var coords in this.scene.map) {
      var parts = coords.split(',')
      var x = parseInt(parts[0])
      var y = parseInt(parts[1])
      this.drawTile(x+this.scene.camera.x, y+this.scene.camera.y, this.scene.map[coords])
    }
    this.drawEntities()
  }
}

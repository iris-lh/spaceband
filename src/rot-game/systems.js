import { ROT } from './vendor/rot'
import { cfg } from './config'
import { tiles } from './tiles'
import _ from 'lodash'

export var s = {
  freeCells: [],
  entities: [],
  map: {},

  act() {
    this.engine.lock()
    window.addEventListener('keydown', this)

    this.computePaths()
    this.moveEntities()
    this.camera.update()
    this.render()
  },

  handleEvent(e) {
    var code = e.keyCode

    if (_.includes(cfg.keyMap.checkBoxKeys, code)) {
      this.checkBox(tiles.box.char)
      return
    }

    if ((code in cfg.keyMap.dirs)) {
      var dir = ROT.DIRS[8][cfg.keyMap.dirs[code]]
      this.player.dx = dir[0]
      this.player.dy = dir[1]
    }

    window.removeEventListener('keydown', this)
    this.engine.unlock()
  },



  checkBox(box) {
    var key = this.player.x + ',' + this.player.y
    if (this.map[key].char != box) {
      alert('There is no box here!')
    } else if (key == this.ananas) {
      alert('Hooray! You found the ananas and won this game.')
      this.engine.lock()
      window.removeEventListener('keydown', this)
    } else {
      alert('This box is empty :-(')
    }
  },



  moveEntities() {
    var self = this
    this.entities.forEach(function(entity) {
      if (entity.isEntity) {

        var newCoords = [ entity.x + entity.dx, entity.y + entity.dy ]

        if (newCoords in self.map) {
          entity.x += entity.dx
          entity.y += entity.dy
        }

        entity.dx = 0
        entity.dy = 0
      }
    })
  },



  computePaths() {
    var entities = this.entities
    for (var ent in entities) {
      var entity = entities[ent]
      if (entity.isEntity && entity.pathAlg && entity.target) {
        var path = []

        var self = this
        var passableCallback = function(targetX, targetY) {
            return (targetX+','+targetY in self.map)
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
  },



  drawEntities() {
    var self = this
    var entities = this.entities
    entities.forEach(function(entity) {
      self.drawTile(
        entity.x + self.camera.x,
        entity.y + self.camera.y,
        entity.tile
      )
    })
  },



  drawTile(x, y, tile) {
    this.display.draw(x, y, tile.char, tile.fg, tile.bg)
  },



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
      this.map[coords] = tiles.floor
      this.freeCells.push(coords)
    }
    digger.create(digCallback.bind(this))

    this.generateBoxes(this.freeCells)
  },



  createActor(what, tile, type, target=null) {
    var index = Math.floor(ROT.RNG.getUniform() * this.freeCells.length)
    var coords = this.freeCells.splice(index, 1)[0]
    var parts = coords.split(',')
    var x = parseInt(parts[0])
    var y = parseInt(parts[1])

    var entity = new what(this, tile, type, x, y, target)

    return entity
  },



  generateBoxes(freeCells) {
    for (var i=0;i<cfg.numOfBoxes;i++) {
      var index = Math.floor(ROT.RNG.getUniform() * this.freeCells.length)
      var coords = this.freeCells.splice(index, 1)[0]
      this.map[coords] = tiles.box
      if (!i) { this.ananas = coords } /* first box contains the ananas */
    }
  },



  render() {
    this.display.clear()
    for (var coords in this.map) {
      var parts = coords.split(',')
      var x = parseInt(parts[0])
      var y = parseInt(parts[1])
      this.drawTile(x+this.camera.x, y+this.camera.y, this.map[coords])
    }
    this.drawEntities()
  }
}

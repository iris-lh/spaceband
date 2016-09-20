import { ROT } from './vendor/rot'
import { cfg } from './config'
import { tiles } from './tiles'
import _ from 'lodash'

export class Systems {
  constructor(game) {
    this.game = game
    console.log('systems constructor - entities: '+this.game.entities)
  }

  update(game){
    this.game = game
  }

  handleEvent(e) {
    var code = e.keyCode

    if (_.includes(this.game.keyMap.checkBoxKeys, code)) {
      this.checkBox(tiles.box.char)
      return
    }

    if ((code in this.game.keyMap.dirs)) {
      var dir = ROT.DIRS[8][this.game.keyMap.dirs[code]]
      this.game.player.dx = dir[0]
      this.game.player.dy = dir[1]
    }

    window.removeEventListener('keydown', this)
    this.game.engine.unlock()
  }



  checkBox(box) {
    var key = this.game.player.x + ',' + this.game.player.y
    if (this.game.map[key].char != box) {
      alert('There is no box here!')
    } else if (key == this.game.ananas) {
      alert('Hooray! You found the ananas and won this game.')
      this.game.engine.lock()
      window.removeEventListener('keydown', this.game)
    } else {
      alert('This box is empty :-(')
    }
  }



  moveEntities(entities) {
    for (var ent in entities) {
      if (entities[ent].isEntity) {
        var entity = entities[ent]

        var newCoords = [ entity.x + entity.dx, entity.y + entity.dy ]


        if (newCoords in this.game.map) {
          entity.x += entity.dx
          entity.y += entity.dy
        }

        entity.dx = 0
        entity.dy = 0
      }
    }
  }



  computePaths(entities) {
    var game = this.game
    for (var ent in entities) {
      var entity = entities[ent]
      if (entity.isEntity && entity.pathAlg && entity.target) {
        var path = []

        var passableCallback = function(targetX, targetY) {
            return (targetX+','+targetY in game.map)
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
          this.game.engine.lock()
        }
      }
    }
  }



  drawEntities() {
    var entities = this.entities
    for (var ent in entities) {
      if (entities[ent].isEntity) {
        var entity = entities[ent]
        this.drawTile(
          entity.x + this.game.camera.x,
          entity.y + this.game.camera.y,
          entity.tile
        )
      }
    }
  }



  drawTile(x, y, tile) {
    this.game.display.draw(x, y, tile.char, tile.fg, tile.bg)
  }



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
    var freeCells = []

    var digCallback = function(x, y, value) {
      if (value) { return }

      var coords = x+','+y
      this.game.map[coords] = tiles.floor
      freeCells.push(coords)
    }
    digger.create(digCallback.bind(this))

    this.generateBoxes(freeCells)

    return freeCells
  }



  createActor(what, tile, type, freeCells, target=null) {
    var index = Math.floor(ROT.RNG.getUniform() * freeCells.length)
    var coords = freeCells.splice(index, 1)[0]
    var parts = coords.split(',')
    var x = parseInt(parts[0])
    var y = parseInt(parts[1])

    var entity = new what(this, tile, type, x, y, target)

    this.game.entities.push(entity)
    return entity
  }



  generateBoxes(freeCells) {
    for (var i=0;i<cfg.numOfBoxes;i++) {
      var index = Math.floor(ROT.RNG.getUniform() * freeCells.length)
      var coords = freeCells.splice(index, 1)[0]
      this.game.map[coords] = tiles.box
      if (!i) { this.game.ananas = coords } /* first box contains the ananas */
    }
  }



  render() {
    this.game.display.clear()
    for (var coords in this.game.map) {
      var parts = coords.split(',')
      var x = parseInt(parts[0])
      var y = parseInt(parts[1])
      this.drawTile(x+this.game.camera.x, y+this.game.camera.y, this.game.map[coords])
    }
    this.drawEntities()
  }
}

import { ROT } from './vendor/rot'
import { cfg } from './config'
import { tiles } from './tiles'
import _ from 'lodash'

export var s = {

  handleEvent(e) {
    var code = e.keyCode

    if (_.includes(game.keyMap.checkBoxKeys, code)) {
      this.checkBox(tiles.box.char)
      return
    }

    if ((code in game.keyMap.dirs)) {
      var dir = ROT.DIRS[8][game.keyMap.dirs[code]]
      game.player.dx = dir[0]
      game.player.dy = dir[1]
    }

    window.removeEventListener('keydown', this)
    game.engine.unlock()
  },



  checkBox(game, box) {
    var key = game.player.x + ',' + game.player.y
    if (game.map[key].char != box) {
      alert('There is no box here!')
    } else if (key == game.ananas) {
      alert('Hooray! You found the ananas and won this game.')
      game.engine.lock()
      window.removeEventListener('keydown', game)
    } else {
      alert('This box is empty :-(')
    }
  },



  moveEntities(game, entities) {
    var entities = game.entities
    for (var ent in entities) {
      if (entities[ent].isEntity) {
        var entity = entities[ent]

        var newCoords = [ entity.x + entity.dx, entity.y + entity.dy ]


        if (newCoords in game.map) {
          entity.x += entity.dx
          entity.y += entity.dy
        }

        entity.dx = 0
        entity.dy = 0
      }
    }
  },



  computePaths(game, entities) {
    var entities = game.entities
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
          game.engine.lock()
        }
      }
    }
  },



  drawEntities(game) {
    var entities = this.entities
    for (var ent in entities) {
      if (entities[ent].isEntity) {
        var entity = entities[ent]
        this.drawTile(
          entity.x + game.camera.x,
          entity.y + game.camera.y,
          entity.tile
        )
      }
    }
  },



  drawTile(game, x, y, tile) {
    game.display.draw(x, y, tile.char, tile.fg, tile.bg)
  },



  generateMap(game) {
    console.log()
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
    console.log('generateMap freeCells: '+freeCells)

    var digCallback = function(x, y, value) {
      if (value) { return }

      var coords = x+','+y
      game.map[coords] = tiles.floor
      game.freeCells.push(coords)
    }
    digger.create(digCallback.bind(this))

    this.generateBoxes(game.freeCells)

    return freeCells
  },



  createActor(game, what, tile, type, freeCells, target=null) {
    var index = Math.floor(ROT.RNG.getUniform() * freeCells.length)
    var coords = freeCells.splice(index, 1)[0]
    var parts = coords.split(',')
    var x = parseInt(parts[0])
    var y = parseInt(parts[1])

    var entity = new what(this, tile, type, x, y, target)

    game.entities.push(entity)
    return entity
  },



  generateBoxes(game, freeCells) {
    for (var i=0;i<cfg.numOfBoxes;i++) {
      var index = Math.floor(ROT.RNG.getUniform() * freeCells.length)
      var coords = freeCells.splice(index, 1)[0]
      game.map[coords] = tiles.box
      if (!i) { game.ananas = coords } /* first box contains the ananas */
    }
  },



  render(game) {
    game.display.clear()
    for (var coords in game.map) {
      var parts = coords.split(',')
      var x = parseInt(parts[0])
      var y = parseInt(parts[1])
      this.drawTile(x+game.camera.x, y+game.camera.y, game.map[coords])
    }
    this.drawEntities()
  }
}

import { ROT } from './vendor/rot'
import { newUUID } from './vendor/uuid'
import { cfg } from './config'
import { _ } from 'lodash'
import yaml from 'yaml'
var jetpack = require('fs-jetpack')



export class SceneBuilder {
  constructor(givenLevel) {
    this.scene = {
      map: {
        freeCells: []
      },
      _entities: [],

      addEntity(entity) {
        this._entities.unshift(entity)
      },

      addEntities(entities) {
        if (!entities) {return}
        entities.forEach( (entity)=> {
          this._entities.unshift(entity)
        })
      },

      addPlayer(player) {
        this.player = player
      },

      entities(type=null) {
        return this._entities.concat(this.player)
      }
    }

    this.scene.tiles = this._loadTiles()
    this.scene.level = this._loadLevel(givenLevel)
    this._matchTilesToEntities(this.scene.tiles, this.scene.level)

    this._generateMap(this.scene, this.scene.level)

    this.scene.addPlayer( this._createActor(this.scene, this.scene.tiles.player) )
    this.scene.addEntities( this._createActors(this.scene, this.scene.level.entities) )
  }

  _loadTiles() {
    var path = __dirname+'/../src/rot-game/tiles.yml'
    var yamlString = jetpack.read(path, 'utf8')
    return yaml.eval(yamlString)
  }

  _loadLevel(givenLevel) {
    var path = __dirname+'/../src/rot-game/levels/'+givenLevel+'.yml'
    var yamlString = jetpack.read(path, 'utf8')
    return yaml.eval(yamlString)
  }

  _matchTilesToEntities(tiles, level) {
    _.forOwn(level.entities, (entity, k1)=> {
      _.forOwn(tiles, (tile, k2)=> {
        if (entity == tile.name) {
          level.entities[k1] = tile
        }
      })
    })
  }

  _generateMap(scene, level) {
    var digger = new ROT.Map.Digger(
      level.map.width,
      level.map.height,
      {
        roomWidth:level.map.digger.roomWidth,
        roomHeight:level.map.digger.roomHeight,
        dugPercentage:level.map.digger.dugPercentage
      }
    )
    var self = this
    var digCallback = function(x, y, value) {
      if (value) { return }

      var coords = x+','+y
      scene.map[coords] = this.scene.tiles.floor
      scene.map.freeCells.push(coords)
    }
    digger.create(digCallback.bind(this))

    this._generateBoxes(scene, level)
  }

  _generateBoxes(scene, level) {
    for (var i=0;i<level.map.numOfBoxes;i++) {
      var index = Math.floor(ROT.RNG.getUniform() * scene.map.freeCells.length)
      var coords = scene.map.freeCells.splice(index, 1)[0]
      scene.map[coords] = this.scene.tiles.box
      if (!i) { scene.ananas = coords } /* first box contains the ananas */
    }
  }

  _createActor(scene, tile) {
    var index = Math.floor(ROT.RNG.getUniform() * scene.map.freeCells.length)
    var coords = scene.map.freeCells.splice(index, 1)[0]
    var parts = coords.split(',')
    var x = parseInt(parts[0])
    var y = parseInt(parts[1])

    return {
      'isEntity': true,
      'id': newUUID(),
      'name': tile.name,
      'type': tile.type,
      'char': tile.char,
      'fg': tile.fg,
      'bg': tile.bg,
      'x': x,
      'y': y,
      'dx': 0,
      'dy': 0,
      'target': tile.target,
    }
  }

  _createActors(scene, entities) {
    if (!entities) {return}
    var generatedEntities = []
    entities.forEach( (entity)=> {
      var index = Math.floor(ROT.RNG.getUniform() * scene.map.freeCells.length)
      var coords = scene.map.freeCells.splice(index, 1)[0]
      var parts = coords.split(',')
      var x = parseInt(parts[0])
      var y = parseInt(parts[1])

      generatedEntities.push({
        'isEntity': true,
        'id': newUUID(),
        'name': entity.name,
        'type': entity.type,
        'char': entity.char,
        'fg': entity.fg,
        'bg': entity.bg,
        'x': x,
        'y': y,
        'dx': 0,
        'dy': 0,
        'target': entity.target,
      })
    })
    return generatedEntities
  }
}

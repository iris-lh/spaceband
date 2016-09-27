import { ROT } from './vendor/rot'
import { newUUID } from './vendor/uuid'
import { cfg } from './config'
import { _ } from 'lodash'



export class SceneBuilder {
  constructor(fileManager, level) {
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

      entities(whitelistType=null) {
        var list = []
        if (whitelistType) {
          this._entities.forEach( (entity)=> {
            if (whitelistType == entity.type) {
              list.push(entity)
            }
          })
        } else {
          list = this._entities.concat(this.player)
        }
        return list
      }
    }

    var fm = fileManager

    this.scene.tiles = fm.loadTiles()
    this.scene.level = fm.loadLevel(level)
    var parsedEntities = fm.parseLevelEntities(this.scene.level)
    var entitiesToAdd = this._matchTilesToEntities(this.scene.tiles.entityTypes, parsedEntities)

    this._generateMap(this.scene, this.scene.level)

    this.scene.addPlayer( this._createActor(this.scene, this.scene.tiles.entityTypes.player) )
    this.scene.addEntities( this._createActors(this.scene, entitiesToAdd) )
  }

  _matchTilesToEntities(entityTypes, entities) {
    var outputEntities = []

    _.forOwn(entities, (entity, k1)=> {

      _.forOwn(entityTypes, (entityType, k2)=> {
        if (entity.type == String(k2)) {
          var foundType = entityType
          var foundVariety

          _.forOwn(foundType.varieties, (variety, varietyKey)=> {
            if (entity.variety == varietyKey) {
              foundVariety = variety
            }
          })
          outputEntities.push(_.merge(foundVariety, foundType))
        }
      })
    })
    return outputEntities
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
      'isEntity':  true,
      'id':        newUUID(),
      'type':      tile.type,
      'name':      tile.name      || tile.type,
      'char':      tile.char,
      'fg':        tile.fg        || 'white',
      'bg':        tile.bg        || null,
      'x':         x,
      'y':         y,
      'dx':        0,
      'dy':        0,
      'target':    tile.target    || null,
      'hasAnanas': tile.hasAnanas || null
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

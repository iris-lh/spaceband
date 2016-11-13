import { ROT }         from './vendor/rot'
import { newUUID }     from './vendor/uuid'
import { cfg }         from './../config'
import { Scene }       from './scene'
import { FileManager } from './file-manager'
import { _ }           from 'lodash'

var fm = FileManager

export class SceneBuilder {
  constructor(levelPath) {
    fm = new FileManager()
  }

  buildScene(input) {
    var scene    = new Scene()
    scene.assets = fm.loadAssets()

    if(typeof input === 'string') { // input is a level path
      var levelPath      = input
      scene.level        = fm.loadLevel(levelPath)
      var parsedEntities = fm.parseLevelEntities(scene.level)
      var entitiesToAdd  = this._matchAssetsToEntities(scene.assets.entities, parsedEntities)
      this._generateMap(scene, scene.level)
      scene.addPlayer(this._createActor(scene, scene.assets.entities.player) )
      scene.addEntities( this._createActors(scene, entitiesToAdd) )
    }
    else if (typeof input === 'object') { // input is save data
      var saveData = input
      scene.map    = saveData.map
      scene.addPlayer(saveData.player)
      scene.addEntities(saveData.entities)
    }

    return scene
  }

  _matchAssetsToEntities(entityTypes, entities) {
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
        roomWidth:     level.map.digger.roomWidth,
        roomHeight:    level.map.digger.roomHeight,
        dugPercentage: level.map.digger.dugPercentage
      }
    )
    var self = this
    var digCallback = function(x, y, value) {
      if (value) { return }

      var coords        = x+','+y
      scene.map[coords] = scene.assets.terrain.floor
      scene.map.freeCells.push(coords)
    }
    digger.create(digCallback.bind(this))

    this._generateBoxes(scene, level)
  }

  _generateBoxes(scene, level) {
    for (var i=0;i<level.map.numOfBoxes;i++) {
      var index         = Math.floor(ROT.RNG.getUniform() * scene.map.freeCells.length)
      var coords        = scene.map.freeCells.splice(index, 1)[0]
      scene.map[coords] = scene.assets.terrain.box
    }
  }

  _createActor(scene, entity) {
    var index  = Math.floor(ROT.RNG.getUniform() * scene.map.freeCells.length)
    var coords = scene.map.freeCells.splice(index, 1)[0]
    var parts  = coords.split(',')
    var x      = parseInt(parts[0])
    var y      = parseInt(parts[1])

    return {
      'isEntity'  : true,
      'id'        : newUUID(),
      'type'      : entity.type,
      'name'      : entity.name      || entity.type,
      'char'      : entity.char,
      'fg'        : entity.fg        || 'white',
      'bg'        : entity.bg        || null,
      'x'         : x,
      'y'         : y,
      'dx'        : 0,
      'dy'        : 0,
      'target'    : entity.target    || null,
      'topology'  : entity.topology,
    }
  }

  _createActors(scene, entities) {
    if (!entities) {return}
    var generatedEntities = []
    entities.forEach( (entity)=> {
      generatedEntities.push(this._createActor(scene, entity))
    })
    return generatedEntities
  }
}

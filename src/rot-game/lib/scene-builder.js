import { ROT } from './vendor/rot'
import { newUUID } from './vendor/uuid'
import { cfg } from './config'
import { Scene } from './scene'
import { FileManager } from './file-manager'
import { _ } from 'lodash'



export class SceneBuilder {
  constructor(level) {
    this.scene = new Scene()
    var fm     = new FileManager()

    this.scene.assets  = fm.loadAssets()
    this.scene.level   = fm.loadLevel(level)
    var parsedEntities = fm.parseLevelEntities(this.scene.level)
    var entitiesToAdd  = this._matchTilesToEntities(this.scene.assets.entities, parsedEntities)

    this._generateMap(this.scene, this.scene.level)
    this.scene.addPlayer(this._createActor(this.scene, this.scene.assets.entities.player) )
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
      scene.map[coords] = this.scene.assets.terrain.floor
      scene.map.freeCells.push(coords)
    }
    digger.create(digCallback.bind(this))

    this._generateBoxes(scene, level)
  }

  _generateBoxes(scene, level) {
    for (var i=0;i<level.map.numOfBoxes;i++) {
      var index = Math.floor(ROT.RNG.getUniform() * scene.map.freeCells.length)
      var coords = scene.map.freeCells.splice(index, 1)[0]
      scene.map[coords] = this.scene.assets.terrain.box
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
      'isEntity'  : true,
      'id'        : newUUID(),
      'type'      : tile.type,
      'name'      : tile.name      || tile.type,
      'char'      : tile.char,
      'fg'        : tile.fg        || 'white',
      'bg'        : tile.bg        || null,
      'x'         : x,
      'y'         : y,
      'dx'        : 0,
      'dy'        : 0,
      'target'    : tile.target    || null,
      'topology'  : tile.topology,
      'hasAnanas' : tile.hasAnanas || null
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

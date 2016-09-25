import { ROT } from './vendor/rot'
import { Actor } from './actor'
//import { tiles } from './tiles'
import { Scene } from './scene'
import { cfg } from './config'
import { _ } from 'lodash'
import yaml from 'yaml'
var jetpack = require('fs-jetpack')



export class SceneBuilder {
  constructor(givenLevel) {
    this.tiles = this._loadTiles()
    this.level = this._loadLevel(givenLevel)
    this._matchTilesToEntities(this.tiles, this.level)
    this.scene = new Scene()

    this._generateMap(this.scene, this.level)

    this.scene.addPlayer( this._createActor(this.scene, this.tiles.player, 'player') )
    this.scene.addEntities( this._createActors(this.scene, this.level) )
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
    console.log('before matchTilesToEntities tiles:',tiles,'level:',level)
    _.forOwn(level.entities, (entity, k1)=> {
      _.forOwn(tiles, (tile, k2)=> {
        if (entity == tile.name) {
          console.log('entity/tile match found')
          level.entities[k1] = tile
        }
      })
    })
    console.log('after matchTilesToEntities tiles:',tiles,'level:',level)
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
      scene.map[coords] = this.tiles.floor
      scene.map.freeCells.push(coords)
    }
    digger.create(digCallback.bind(this))

    this._generateBoxes(scene, level)
  }

  _generateBoxes(scene, level) {
    for (var i=0;i<level.map.numOfBoxes;i++) {
      var index = Math.floor(ROT.RNG.getUniform() * scene.map.freeCells.length)
      var coords = scene.map.freeCells.splice(index, 1)[0]
      scene.map[coords] = this.tiles.box
      if (!i) { scene.ananas = coords } /* first box contains the ananas */
    }
  }

  _createActor(scene, tile, type, target=null) {
    var index = Math.floor(ROT.RNG.getUniform() * scene.map.freeCells.length)
    var coords = scene.map.freeCells.splice(index, 1)[0]
    var parts = coords.split(',')
    var x = parseInt(parts[0])
    var y = parseInt(parts[1])

    var entity = new Actor(tile, type, x, y, target)

    return entity
  }

  _createActors(scene, level, target=null) {
    if (!level.entities) {return}
    var generatedEntities = []
    level.entities.forEach( (entity)=> {
      var index = Math.floor(ROT.RNG.getUniform() * scene.map.freeCells.length)
      var coords = scene.map.freeCells.splice(index, 1)[0]
      var parts = coords.split(',')
      var x = parseInt(parts[0])
      var y = parseInt(parts[1])

      var generatedEntity = new Actor(entity.tile, entity.type, x, y, target)
      generatedEntities.push(generatedEntity)
    })
    return generatedEntities
  }
}

import { _ }   from 'lodash'
import yaml    from 'yaml'
import jetpack from 'fs-jetpack'


export class FileManager {
  constructor() {
    this.gamePath   = jetpack.cwd()+'/src/rot-game/'
    this.assetsPath = this.gamePath+'assets/'
  }

  loadAssets() {
    var entitiesPath, terrainPath,
        entityFiles, terrainFiles,
        assets, entities, terrain

    entitiesPath = this.assetsPath+'entities/'
    terrainPath  = this.assetsPath+'terrain/'
    entityFiles  = jetpack.list(this.assetsPath+'entities/')
    terrainFiles = jetpack.list(this.assetsPath+'terrain/')

    assets       = {}
    entities     = {}
    terrain      = {}

    entityFiles.forEach( (entityFile)=> {
      var yamlString                  = jetpack.read(entitiesPath+entityFile, 'utf8')
      var entityDefinition            = (yaml.eval(yamlString))
      entities[entityDefinition.type] = entityDefinition
    })

    terrainFiles.forEach( (terrainFile)=> {
      var yamlString                  = jetpack.read(terrainPath+terrainFile, 'utf8')
      var terrainDefinition           = (yaml.eval(yamlString))
      terrain[terrainDefinition.type] = terrainDefinition
    })

    assets.entities = entities
    assets.terrain  = terrain

    return assets

  }

  loadLevel(levelPath) {
    var yamlString = jetpack.read(levelPath, 'utf8')
    return yaml.eval(yamlString)
  }

  parseLevelEntities(level) {
    if (!level.entities) {return}
    var entities = []
    level.entities.forEach( (entity)=> {
      var parts = entity.split('.')
      entities.push({
        type:    parts[0]||entity,
        variety: parts[1]||null
      })
    })
    return entities
  }

  saveGame(scene, path) {
    var saveData = {
      map:      scene.map,
      entities: scene._entities,
      player:   scene.player
    }
    jetpack.write(path, saveData, {jsonIndent: 0})
  }

  loadGame(path) {
    return jetpack.read(path, 'json')
  }

}

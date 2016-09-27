import { _ } from 'lodash'
import yaml from 'yaml'
import jetpack from 'fs-jetpack'


export class FileManager {
  constructor(gamePath) {
    this.levelsPath = gamePath+'levels/'
    this.tilesPath = gamePath+'tiles.yml'
  }

  loadTiles() {
    var path = __dirname+'/../src/rot-game/tiles.yml'
    var yamlString = jetpack.read(path, 'utf8')
    return yaml.eval(yamlString)
  }

  loadLevel(yamlLevel) {
    var path = __dirname+'/../src/rot-game/levels/'+yamlLevel+'.yml'
    var yamlString = jetpack.read(path, 'utf8')
    return yaml.eval(yamlString)
  }

  parseLevelEntities(level) {
    if (!level.entities) {return}
    var entities = []
    level.entities.forEach( (entity)=> {
      var parts = entity.split('.')
      entities.push({
        type: parts[0],
        variety: parts[1]
      })
    })
    return entities
  }

}

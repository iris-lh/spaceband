export class Scene {
  constructor () {
    this.map           = {}
    this.map.freeCells = []
    this._entities     = []
  }

  addEntity(entity) {
    this._entities.unshift(entity)
  }

  addEntities(entities) {
    if (!entities) {return}
    entities.forEach( (entity)=> {
      this._entities.unshift(entity)
    })
  }

  addPlayer(player) {
    this.player = player
  }

  entities(whitelistType=null) {
    var allEntities    = this._entities.concat(this.player)
    var outputEntities = []
    if (whitelistType) {
      allEntities.forEach( (entity)=> {
        if (whitelistType == entity.type) {
          outputEntities.push(entity)
        }
      })
    } else {
      outputEntities = allEntities
    }
    return outputEntities
  }

}

export class Scene {
  constructor () {
    this.map = {}
    this.map.freeCells = []
    this._entities = []
  }

  addEntity(entity) {
    this._entities.unshift(entity)
  }

  addEntities(entities) {
    if (!entities) {return}
    entities.forEach( (entity)=> {
      this._entities.unshift(entity)
    })
    console.log('addEntities',this._entities)
  }

  addPlayer(player) {
    this.player = player
  }

  entities(type=null) {
    return this._entities.concat(this.player)
  }

}

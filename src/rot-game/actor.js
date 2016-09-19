export class Actor {
  constructor(game, tile, type, x, y) {
    this.isEntity = true
    this._game = game
    this.tile = tile
    this.type = type
    this.x = x
    this.y = y
    this.dx = 0
    this.dy = 0
  }

  act() {
    //this._processTurn()
  }
}

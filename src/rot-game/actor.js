export class Actor {
  constructor(game, tile, x, y) {
    this.isEntity = true
    this._game = game
    this._tile = tile
    this.x = x
    this.y = y
    this.dx = 0
    this.dy = 0
  }

  act() {
    //this._processTurn()
  }
}

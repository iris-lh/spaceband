export class Actor {
  constructor(game, tile, x, y) {
    this.isEntity = true
    this._game = game
    this._tile = tile
    this._x = x
    this._y = y

  }

  act() {
    this._processTurn()
  }
}

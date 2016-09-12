export class Actor {
  constructor(game, tile, x, y) {
    this._game = game
    this._tile = tile
    this._x = x
    this._y = y

    this._draw()
  }

  act() {
    this._processTurn()
  }

  _draw() {
    this._game.drawTile(this._x, this._y, this._tile)
  }
}


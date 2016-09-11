import { ROT } from './rot'
import { cfg } from './config'
import { tiles } from './tiles'
import { Player } from './player'
import { Pedro } from './pedro'


export var Game = {
  display: null,
  map: {},
  engine: null,
  player: null,
  pedro: null,
  ananas: null,

  entities: {},

  init(electronRemote) {
    this.app = electronRemote
    var win = this._gameWindow()
    this.display = new ROT.Display({
      width:            win.width,
      height:           win.height,
      spacing:          1,
      forceSquareRatio: true,
      fontSize:         cfg.fontSize,
      fg:               cfg.floorFg
    })
    document.body.appendChild(this.display.getContainer())

    this._generateMap()

    var scheduler = new ROT.Scheduler.Simple()
    scheduler.add(this.player, true)
    scheduler.add(this.pedro, true)

    this.engine = new ROT.Engine(scheduler)
    this.engine.start()
  },

  _gameWindow() {
    var gameWindow = this.app.getCurrentWindow().getBounds()
    return {
      width: Math.floor(gameWindow.width / cfg.fontSize),
      height: Math.floor(gameWindow.height / cfg.fontSize),
      pixelWidth: gameWindow.width,
      pixelHeight: gameWindow.height
    }
  },

  _drawTile(x, y, tile) {
    console.log('_drawTile activated')
    this.display.draw(x, y, tile.char, tile.fg, tile.bg)
  },

  _generateMap() {
    var win = this._gameWindow()
    var digger = new ROT.Map.Digger(win.width, win.height)
    var freeCells = []

    var digCallback = function(x, y, value) {
        if (value) { return }

      var key = x+','+y
      this.map[key] = tiles.floor
      freeCells.push(key)
    }
    digger.create(digCallback.bind(this))

    this._generateBoxes(freeCells)
    this._drawWholeMap()

    this.player = this._createActor(Player, freeCells)
    this.pedro = this._createActor(Pedro, freeCells)
  },

  _createActor(what, freeCells) {
    var index = Math.floor(ROT.RNG.getUniform() * freeCells.length)
    var key = freeCells.splice(index, 1)[0]
    var parts = key.split(',')
    var x = parseInt(parts[0])
    var y = parseInt(parts[1])
    return new what(this, x, y)
  },

  _generateBoxes(freeCells) {
    for (var i=0;i<cfg.numOfBoxes;i++) {
      var index = Math.floor(ROT.RNG.getUniform() * freeCells.length)
      var key = freeCells.splice(index, 1)[0]
      this.map[key] = tiles.box
      if (!i) { this.ananas = key } /* first box contains an ananas */
    }
  },

  _drawWholeMap() {
    for (var key in this.map) {
      var parts = key.split(',')
      var x = parseInt(parts[0])
      var y = parseInt(parts[1])
      if (this.map[key].char == tiles.box.char) {
        this._drawTile(x, y, tiles.box)
      } else {
        this._drawTile(x, y, this.map[key])
      }
    }
  }
}

import { ROT } from './rot'
import { cfg } from './config'
import { tiles } from './tiles'
import { Player } from './player'
import { Bandito } from './bandito'


export var Game = {
  display: null,
  map: {},
  engine: null,
  camera: {},
  player: null,
  pedro: null,
  ananas: null,

  entities: {},

  init(electronRemote) {

    this.tempWidth = 50
    this.tempHeight = 30

    this.camera = {
      x: 0,
      y: 0
    }

    this.app = electronRemote
    var win = this._gameWindow()
    this.display = new ROT.Display({
      width:            this.tempWidth,
      height:           this.tempHeight,
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
    //scheduler.add(this.pablo, true)

    scheduler.add(this, true)

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

  drawTile(x, y, tile) {
    this.display.draw(x, y, tile.char, tile.fg, tile.bg)
  },

  _generateMap() {
    var win = this._gameWindow()
    var digger = new ROT.Map.Digger(50, 50, {roomWidth:[3,7], roomHeight:[3,7],dugPercentage:0.3})
    var freeCells = []

    var digCallback = function(x, y, value) {
        if (value) { return }

      var coords = x+','+y
      this.map[coords] = tiles.floor
      freeCells.push(coords)
    }
    digger.create(digCallback.bind(this))

    this._generateBoxes(freeCells)

    this.player = this._createActor(Player, tiles.player, freeCells)
    this.pedro  = this._createActor(Bandito,  tiles.pedro,  freeCells)
    //this.pablo  = this._createActor(Bandito,  tiles.pablo,  freeCells)

    this.camera.x = -this.player._x + Math.floor(this.tempWidth/2)
    this.camera.y = -this.player._y + Math.floor(this.tempHeight/2)
    this._drawWholeMap()
  },

  _createActor(what, tile, freeCells) {
    var index = Math.floor(ROT.RNG.getUniform() * freeCells.length)
    var coords = freeCells.splice(index, 1)[0]
    var parts = coords.split(',')
    var x = parseInt(parts[0])
    var y = parseInt(parts[1])
    return new what(this, tile, x, y)
  },

  _generateBoxes(freeCells) {
    for (var i=0;i<cfg.numOfBoxes;i++) {
      var index = Math.floor(ROT.RNG.getUniform() * freeCells.length)
      var coords = freeCells.splice(index, 1)[0]
      this.map[coords] = tiles.box
      if (!i) { this.ananas = coords } /* first box contains an ananas */
    }
  },

  _drawWholeMap() {
    this.display.clear()
    console.log('drawing map')
    for (var coords in this.map) {
      var parts = coords.split(',')
      var x = parseInt(parts[0])
      var y = parseInt(parts[1])
      this.drawTile(x+this.camera.x, y+this.camera.y, this.map[coords])
    }
  },

  act() {
    this._drawWholeMap()

    this.player._draw()


    this.pedro._draw()
  }
}

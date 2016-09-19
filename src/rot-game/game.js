import { ROT } from './vendor/rot'
import { cfg } from './config'
import { tiles } from './tiles'
import { Camera } from './camera'
import { Player } from './player'
import { Bandito } from './bandito'
import _ from 'lodash'



export var Game = {
  display: null,
  map: {},
  freecells: [],
  engine: null,
  player: null,
  pedro: null,
  ananas: null,

  entities: [],

  init(electronRemote) {
    this.app = electronRemote

    this.tempWidth = 50
    this.tempHeight = 30


    this.display = new ROT.Display({
      width:            this.tempWidth,
      height:           this.tempHeight,
      spacing:          1,
      forceSquareRatio: true,
      fontSize:         cfg.fontSize,
      fg:               cfg.floorFg
    })
    document.body.appendChild(this.display.getContainer())

    window.addEventListener('keydown', this)

    this.keyMap = cfg.keyMap

    this.scheduler = new ROT.Scheduler.Simple()

    this.freeCells = this._generateMap()
    this.player = this._createActor(Player, tiles.player, 'player', this.freeCells)
    //this._createActor(Bandito, tiles.pedro, 'bandito', this.freeCells)

    this.camera = new Camera(this.display, this.player)

    this.scheduler.add(this, true)

    this.engine = new ROT.Engine(this.scheduler)
    this.engine.start()

    this.render()
  },

  act() {
    this.engine.lock()
    window.addEventListener('keydown', this)
    this.moveEntities(this.entities)
    this.camera.update()
    this.render()
  },

  handleEvent(e) {
    var code = e.keyCode

    if (_.includes(this.keyMap.checkBoxKeys, code)) {
      console.log('event: checkBox')
      this.checkBox(tiles.box.char)
      return
    }

    /* one of numpad directions? */
    if ((code in this.keyMap.dirs)) {
      console.log('event: direction')
      var dir = ROT.DIRS[8][this.keyMap.dirs[code]]
      this.player.dx = dir[0]
      this.player.dy = dir[1]
    }

    window.removeEventListener('keydown', this)
    this.engine.unlock()
  },

  checkBox(box) {
    var key = this.player.x + ',' + this.player.y
    if (this.map[key].char != box) {
      alert('There is no box here!')
    } else if (key == this.ananas) {
      alert('Hooray! You found the ananas and won this game.')
      this.engine.lock()
      window.removeEventListener('keydown', this)
    } else {
      alert('This box is empty :-(')
    }
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

  moveEntities(entities) {
    for (var ent in entities) {
      if (entities[ent].isEntity) {
        var newCoords = [ entities[ent].x + entities[ent].dx, entities[ent].y + entities[ent].dy ]
        if (newCoords in this.map) {
          entities[ent].x += entities[ent].dx
          entities[ent].y += entities[ent].dy
        }
        entities[ent].dx = 0
        entities[ent].dy = 0
      }
    }
  },

  drawEntities() {
    var entities = this.entities
    for (var ent in entities) {
      if (entities[ent].isEntity) {
        this.drawTile(
          entities[ent].x + this.camera.x,
          entities[ent].y + this.camera.y,
          entities[ent].tile
        )
      }
    }
  },

  drawTile(x, y, tile) {
    this.display.draw(x, y, tile.char, tile.fg, tile.bg)
  },

  _generateMap() {
    var win = this._gameWindow()
    var digger = new ROT.Map.Digger(cfg.mapWidth, cfg.mapHeight, {roomWidth:[3,7], roomHeight:[3,7],dugPercentage:0.3})
    var freeCells = []

    var digCallback = function(x, y, value) {
      if (value) { return }

      var coords = x+','+y
      this.map[coords] = tiles.floor
      freeCells.push(coords)
    }
    digger.create(digCallback.bind(this))

    this._generateBoxes(freeCells)

    return freeCells
  },

  _createActor(what, tile, freeCells) {
    var index = Math.floor(ROT.RNG.getUniform() * freeCells.length)
    var coords = freeCells.splice(index, 1)[0]
    var parts = coords.split(',')
    var x = parseInt(parts[0])
    var y = parseInt(parts[1])

    var entity = new what(this, tile, x, y)

    this.entities.push(entity)
    this.scheduler.add(entity, true)
    return entity
  },

  _generateBoxes(freeCells) {
    for (var i=0;i<cfg.numOfBoxes;i++) {
      var index = Math.floor(ROT.RNG.getUniform() * freeCells.length)
      var coords = freeCells.splice(index, 1)[0]
      this.map[coords] = tiles.box
      if (!i) { this.ananas = coords } /* first box contains the ananas */
    }
  },

  render() {
    this.display.clear()
    for (var coords in this.map) {
      var parts = coords.split(',')
      var x = parseInt(parts[0])
      var y = parseInt(parts[1])

      if ( (x > 0) && (x+this.camera.x < cfg.mapWidth) && (y > 0) && (y+this.camera.y < cfg.mapHeight) ) {
        this.drawTile(x+this.camera.x, y+this.camera.y, this.map[coords])
      }
    }
    this.drawEntities()
  }
}

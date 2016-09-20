import { ROT } from './vendor/rot'
import { s } from './systems'
import { cfg } from './config'
import { tiles } from './tiles'
import { Camera } from './camera'
import { Actor } from './actor'
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
    this.keyMap = cfg.keyMap
    this.display = new ROT.Display({
      width:            this.tempWidth,
      height:           this.tempHeight,
      spacing:          1,
      forceSquareRatio: true,
      fontSize:         cfg.fontSize,
      fg:               cfg.floorFg
    })
    document.body.appendChild(this.display.getContainer())

    this.scheduler = new ROT.Scheduler.Simple()
    this.scheduler.add(this, true)

    this.freeCells = s.generateMap(this)
    this.player = s.createActor(this, Actor, tiles.player, 'player', this.freeCells)
    s.createActor(this, Actor, tiles.pedro, 'bandito', this.freeCells, this.player)
    _.reverse(this.entities)

    this.camera = new Camera (this.display, this.player, 'center')

    this.engine = new ROT.Engine(this.scheduler)
    this.engine.start()

    this.act()
  },

  act() {
    this.engine.lock()
    window.addEventListener('keydown', this)

    s.computePaths(this)
    s.moveEntities(this)
    this.camera.update()
    s.render(this)
  },
}

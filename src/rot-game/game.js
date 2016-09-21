import { ROT } from './vendor/rot'
import { s } from './systems'
import { cfg } from './config'
import { tiles } from './tiles'
import { Camera } from './camera'
import { Actor } from './actor'
import _ from 'lodash'

export var Game = {

  init(electronRemote) {
    this.app = electronRemote
    this.tempWidth = 50
    this.tempHeight = 30
    s.display = new ROT.Display({
      width:            this.tempWidth,
      height:           this.tempHeight,
      spacing:          1,
      forceSquareRatio: true,
      fontSize:         cfg.fontSize,
      fg:               cfg.floorFg
    })
    document.body.appendChild(s.display.getContainer())

    var scheduler = new ROT.Scheduler.Simple()
    scheduler.add(s, true)

    s.generateMap()
    s.player = s.createActor(Actor, tiles.player, 'player')

    var entities = []
    entities.push( s.player )
    entities.push( s.createActor(Actor, tiles.pedro, 'bandito', s.player) )
    s.entities = _.reverse(entities)

    s.camera = new Camera (s.display, s.player, 'center')

    s.engine = new ROT.Engine(scheduler)
    s.engine.start()
  }

}

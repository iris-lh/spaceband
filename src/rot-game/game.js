import { ROT } from './vendor/rot'
import { Systems } from './systems'
import { Scene } from './scene'
import { cfg } from './config'
import { tiles } from './tiles'
import { Camera } from './camera'
import { Actor } from './actor'
import { _ } from 'lodash'

export var Game = {

  init(electronRemote) {
    var s = new Systems

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

    var scene = new Scene

    s.generateMap()
    var player = s.createActor(Actor, tiles.player, 'player')

    scene.addPlayer( player )
    scene.addEntity( s.createActor(Actor, tiles.pedro, 'bandito', scene.player) )

    scene.addCamera( new Camera (s.display, scene.player, 'center') )

    s.scene = scene

    s.engine = new ROT.Engine(scheduler)
    s.engine.start()
  }
}

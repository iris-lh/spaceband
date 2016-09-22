import { ROT } from './vendor/rot'
import { Systems } from './systems'
import { Scene } from './scene'
import { cfg } from './config'
import { tiles } from './tiles'
import { Camera } from './camera'
import { Actor } from './actor'
import _ from 'lodash'

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

    s.scene = new Scene

    s.generateMap()
    s.scene.player = s.createActor(Actor, tiles.player, 'player')

    var entities = []
    s.scene.entities.unshift( s.scene.player )
    s.scene.entities.push( s.createActor(Actor, tiles.pedro, 'bandito', s.scene.player) )
    //s.scene.entities = _.reverse(entities)

    s.scene.camera = new Camera (s.display, s.scene.player, 'center')

    console.log('s.scene:', s.scene)

    s.engine = new ROT.Engine(scheduler)
    s.engine.start()
  }
}

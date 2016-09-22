import { ROT } from './vendor/rot'
import { Systems } from './systems'
import { SceneBuilder } from './scene-builder'
import { cfg } from './config'

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

    var builder = new SceneBuilder(s)

    s.scene = builder.scene

    s.engine = new ROT.Engine(scheduler)
    s.engine.start()
  }
}

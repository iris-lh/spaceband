import { ROT } from './vendor/rot'
import { Systems } from './systems'
import { SceneBuilder } from './scene-builder'
import { View } from './view'



export var Game = {

  init() {
    // setup game system
    var scene     = new SceneBuilder('04').scene
    var view      = new View(scene)
    var system    = new Systems(scene, view)

    // setup game engine
    var scheduler = new ROT.Scheduler.Simple()
    var engine    = new ROT.Engine(scheduler)
    system.engine = engine

    // starting up
    scheduler.add(system, true)
    view.attachToDOM()
    system.engine.start()
  }

}

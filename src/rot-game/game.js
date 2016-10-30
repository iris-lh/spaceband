import { ROT }          from './lib/vendor/rot'
import { Systems }      from './lib/systems'
import { FileManager }  from './lib/file-manager'
import { SceneBuilder } from './lib/scene-builder'
import { View }         from './lib/view'
import jetpack          from 'fs-jetpack'


export var Game = {

  init() {
    // setup game system
    var scene     = new SceneBuilder('06').scene
    var view      = new View(scene)
    var system    = new Systems(scene, view)

    // setup game engine
    var scheduler = new ROT.Scheduler.Simple()
    system.engine = new ROT.Engine(scheduler)

    // starting up
    scheduler.add(system, true)
    view.attachToDOM()
    system.engine.start()
  }

}

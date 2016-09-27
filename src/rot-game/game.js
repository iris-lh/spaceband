import { ROT } from './vendor/rot'
import { Systems } from './systems'
import { FileManager } from './file-manager'
import { SceneBuilder } from './scene-builder'
import { View } from './view'
import jetpack from 'fs-jetpack'


export var Game = {

  init() {
    // setup game system
    var gamePath  = jetpack.cwd()+'src/rot-game/'
    console.log(gamePath)
    var fm   = new FileManager(gamePath)
    var scene     = new SceneBuilder(fm, '00').scene
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

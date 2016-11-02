import { ROT }          from './lib/vendor/rot'
import { Systems }      from './lib/systems'
import { FileManager }  from './lib/file-manager'
import { SceneBuilder } from './lib/scene-builder'
import { View }         from './lib/view'
import jetpack          from 'fs-jetpack'

const dialog = require('electron').remote.dialog



export var Game = {

  init() {

    var level
    var buttonPressed = dialog.showMessageBox({
      type:    'question',
      title:   '',
      message: 'SpaceBand',
      detail:  '',
      buttons: ['Play', 'Select Level']
    })

    if (buttonPressed == 1) {
      level = dialog.showOpenDialog({properties: ['openFile']})[0]
    } else {
      level = '/Users/isu/coding/gamedev/rot/spaceband/src/rot-game/assets/levels/00.yml'
    }

    // setup game system
    var scene     = new SceneBuilder(level).scene
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

import jetpack          from 'fs-jetpack'
import { ROT }          from './lib/vendor/rot'
import { Systems }      from './lib/systems'
import { FileManager }  from './lib/file-manager'
import { SceneBuilder } from './lib/scene-builder'
import { View }         from './lib/view'
import { UserDialog }   from './lib/user-dialog'
import { cfg }          from './config'



export var Game = {

  defaultLevel: jetpack.cwd()+'/app/assets/levels/00.yml',

  init() {
    this.fm = new FileManager
    window.addEventListener('keydown', this)
    this.startGame(this.defaultLevel)
  },

  startGame(dataOrPath) {
    // setup game system
    var builder = new SceneBuilder()
    var scene   = builder.buildScene(dataOrPath)
    var view    = new View(scene)
    this.system = new Systems(scene, view)

    // setup game engine
    var scheduler      = new ROT.Scheduler.Simple()
    this.system.engine = new ROT.Engine(scheduler)

    // starting up
    scheduler.add(this.system, true)
    view.attachToDOM()
    this.system.engine.start()
  },

  handleEvent(e) {
    var code = e.keyCode
    if (code == cfg.keyMap.loadLevel) {
      this.levelPath = UserDialog.chooseLevel()
      this.startGame(this.levelPath)
    }
    if (code == cfg.keyMap.resetLevel) {
      this.startGame(this.levelPath)
    }
    if (code == cfg.keyMap.saveGame) {
      var path = UserDialog.chooseSaveGamePath()
      this.fm.saveGame(this.system.scene, path)
    }
    if (code == cfg.keyMap.loadGame) {
      var path     = UserDialog.chooseLoadGamePath()
      var loadData = this.fm.loadGame(path)
      this.startGame(loadData)
    }
  }

}

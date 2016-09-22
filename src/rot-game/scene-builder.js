import { ROT } from './vendor/rot'
import { Actor } from './actor'
import { tiles } from './tiles'
import { Camera } from './camera'
import { Scene } from './scene'
import { cfg } from './config'

export class SceneBuilder {
  constructor(system) {
    var scene = new Scene()

    this.generateMap(scene)
    var player = this.createActor(scene, tiles.player, 'player')

    scene.addPlayer( player )
    scene.addEntity( this.createActor(scene, tiles.pedro, 'bandito', scene.player) )

    scene.addCamera( new Camera(system.display, scene.player, 'center') )

    this.scene = scene
  }

  generateMap(scene) {
    var digger = new ROT.Map.Digger(
      cfg.mapWidth,
      cfg.mapHeight,
      {
        roomWidth:[3,7],
        roomHeight:[3,7],
        dugPercentage:0.3
      }
    )
    var digCallback = function(x, y, value) {
      if (value) { return }

      var coords = x+','+y
      scene.map[coords] = tiles.floor
      scene.map.freeCells.push(coords)
    }
    digger.create(digCallback.bind(this))

    this.generateBoxes(scene)
  }

  generateBoxes(scene) {
    for (var i=0;i<cfg.numOfBoxes;i++) {
      var index = Math.floor(ROT.RNG.getUniform() * scene.map.freeCells.length)
      var coords = scene.map.freeCells.splice(index, 1)[0]
      scene.map[coords] = tiles.box
      if (!i) { scene.ananas = coords } /* first box contains the ananas */
    }
  }

  createActor(scene, tile, type, target=null) {
    var index = Math.floor(ROT.RNG.getUniform() * scene.map.freeCells.length)
    var coords = scene.map.freeCells.splice(index, 1)[0]
    var parts = coords.split(',')
    var x = parseInt(parts[0])
    var y = parseInt(parts[1])

    var entity = new Actor(this, tile, type, x, y, target)

    return entity
  }
}

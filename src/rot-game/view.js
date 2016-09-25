import { ROT } from './vendor/rot'
import { util } from './util'
import { cfg } from './config'
import { Camera } from './camera'

export class View {

  constructor(scene) {
    this.scene = scene
    this.display = this._createDisplay()
    this._createCamera()
    this._setupResizeListener()
  }

  attachToDOM() {
    document.body.innerHTML = ''
    document.body.appendChild(this.display.getContainer())
  }

  render() {
    this.camera.update()
    this.display.clear()
    this._drawMap()
    this._drawEntities()
  }

  _drawMap() {
    for (var coords in this.scene.map) {
      var parts = coords.split(',')
      var x = parseInt(parts[0])
      var y = parseInt(parts[1])
      this._drawTile(x+this.camera.x, y+this.camera.y, this.scene.map[coords])
    }
  }

  _drawEntities() {
    var scene = this.scene
    var entities = this.scene.entities()
    console.log('_drawEntities entities:',entities)
    entities.forEach((entity) => {
      this._drawTile(
        entity.x + this.camera.x,
        entity.y + this.camera.y,
        entity.tile
      )
    })
  }

  _drawTile(x, y, tile) {
    this.display.draw(x, y, tile.char, tile.fg, tile.bg)
  }

  _createDisplay() {
    var window = util.gameWindow()
    return new ROT.Display({
      width:            window.width,
      height:           window.height,
      spacing:          1,
      forceSquareRatio: true,
      fontSize:         cfg.fontSize,
      fg:               cfg.floorFg
    })
  }

  _createCamera() {
    this.camera = new Camera(this.display, this.scene.player, 'center')
  }

  _setupResizeListener() {
    util.setupResizeListener( ()=> {
      this.display = this._createDisplay()
      this.camera.setDisplay(this.display)
      this.attachToDOM()
      this.render()
    })
  }

}

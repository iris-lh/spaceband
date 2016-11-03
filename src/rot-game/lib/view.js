import { ROT }    from './vendor/rot'
import { util }   from './util'
import { cfg }    from './../config'
import { Camera } from './camera'
import { _ }      from 'lodash'

export class View {

  constructor(scene) {
    this.scene         = scene
    this.display       = this._createDisplay()
    this._messageStack = []

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
    this.drawMessages()
  }

  addMessage(message, turn, shouldDrawNow=false) {
    var paddingSpaces = 4 - String(turn).length
    var padding       = _.repeat(' ', paddingSpaces)
    message           = '\n'+turn+padding+message
    this._messageStack.unshift(message)
    if (shouldDrawNow) {
      this.drawMessages()
    }
  }

  drawMessages() {
    var stack    = this._messageStack
    var stackMax = 5
    if (stack.length > 5) {stack.pop()}
    var cursor = -2
    stack.forEach( (message, i)=> {
      var c  = Math.ceil(255/(i+1))
      var fg = 'rgb('+c+','+c+','+c+')'
      this.display.drawText(0, stack.length+cursor, message, fg, 'black')
      cursor -= 1
    })
  }

  _drawMap() {
    for (var coords in this.scene.map) {
      var parts = coords.split(',')
      if (parts.length == 2) {
        var tile = this.scene.map[coords]
        var x    = parseInt(parts[0])
        var y    = parseInt(parts[1])
        this.display.draw(
          x+this.camera.x,
          y+this.camera.y,
          tile.char,
          tile.fg,
          this.scene.assets.terrain.floor.bg
        )
      }
    }
  }

  _drawEntities() {
    var scene    = this.scene
    var entities = this.scene.entities()
    entities.forEach( (entity)=> {
      this.display.draw(
        entity.x + this.camera.x,
        entity.y + this.camera.y,
        entity.char,
        entity.fg,
        scene.assets.terrain.floor.bg
      )
    })
  }

  _drawTile(x, y, char, fg, bg) {
    this.display.draw(x, y, char, fg, bg)
  }

  _createDisplay() {
    var window = util.gameWindow()
    return new ROT.Display({
      width:            window.width,
      height:           window.height,
      spacing:          1,
      forceSquareRatio: true,
      fontSize:         cfg.fontSize,
      fontFamily:       cfg.fontFamily,
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

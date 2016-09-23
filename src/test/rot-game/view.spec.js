import { expect } from 'chai'
import td from 'testdouble'
import { View } from '../../rot-game/view'
import { SceneBuilder } from '../../rot-game/scene-builder'
import { Scene } from '../../rot-game/scene'
import { ROT } from '../../rot-game/vendor/rot'
import { Camera } from '../../rot-game/camera'



describe('View', ()=> {
  var view, scene, builder

  beforeEach( ()=> {
    builder = new SceneBuilder
    scene = builder.scene
    view = new View(scene)
  })

  describe('new', ()=> {
    it('has a scene', ()=> {
      expect(view.scene).to.eq(scene)
    })

    it('has a ROT.Display', ()=> {
      expect(view.display).to.be.an.instanceof(ROT.Display)
    })

    it('has a Camera', ()=> {
      expect(view.camera).to.be.an.instanceof(Camera)
    })
  })

  describe('render', ()=> {
    it('updates the camera', ()=> {
      var update = td.function('.update')
      var fakeCamera = { update: update }
      view.camera = fakeCamera

      view.render()

      td.verify(fakeCamera.update())
    })

    it('clears the display', ()=> {
      var clear = td.function('.clear')
      var draw = td.function('.draw')
      var fakeDisplay = { clear: clear, draw: draw }
      view.display = fakeDisplay

      view.render()

      td.verify(fakeDisplay.clear())
    })

    it('draws the map', ()=> {
      view._drawMap = td.function('._drawMap')

      view.render()

      td.verify(view._drawMap())
    })

    it('draws the entities', ()=> {
      view._drawEntities = td.function('._drawEntities')

      view.render()

      td.verify(view._drawEntities())
    })

    afterEach( ()=> {
      td.reset()
    })
  })

  describe('_drawMap', ()=> {
    it('draws each map tile', ()=> {
      var size = function(obj) {
        var size = 0, key;
        for (key in obj) {
          if (obj.hasOwnProperty(key)) size++;
        }
        return size;
      }
      view._drawTile = td.function('._drawTile')

      view._drawMap()

      td.verify(view._drawTile(), {
          times: size(view.scene.map),
          ignoreExtraArgs: true
      })
    })

    afterEach( ()=> {
      td.reset()
    })
  })

  describe('_drawEntities', ()=> {
    it('draws each entity tile', ()=> {
      view._drawTile = td.function('._drawTile')

      view._drawEntities()

      td.verify(view._drawTile(), {
        times: view.scene.entities().length,
        ignoreExtraArgs: true
      })
    })

    afterEach( ()=> {
      td.reset()
    })
  })

  describe('_drawTile', ()=> {
    it('draws a tile', ()=> {
      var draw = td.function('.draw')
      var fakeDisplay = { draw: draw }
      var fakeTile = {char:'@', fg:'999', bg:'111'}
      view.display = fakeDisplay

      view._drawTile(1, 1, fakeTile)

      td.verify(view.display.draw(
        1, 1, fakeTile.char, fakeTile.fg, fakeTile.bg
      ))
    })

    afterEach( ()=> {
      td.reset()
    })
  })

  describe('_createDisplay', ()=> {
    it('creates a ROT Display object', ()=> {
      var tempView = view
      tempView.display = null

      tempView._createDisplay()

      expect(tempView.display).to.be.an.instanceof(ROT.Display)
    })
  })

  describe('_createCamera', ()=> {
    it('creates a Camera object', ()=> {
      var tempView = view
      tempView.camera = null

      tempView._createCamera()

      expect(tempView.camera).to.be.an.instanceof(Camera)
    })
  })
})

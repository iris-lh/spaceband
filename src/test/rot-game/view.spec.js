import { expect } from 'chai'
import td from 'testdouble'
import { ROT } from '../../rot-game/lib/vendor/rot'
import { View } from '../../rot-game/lib/view'
import { SceneBuilder } from '../../rot-game/lib/scene-builder'
import { Scene } from '../../rot-game/lib/scene'
import { Camera } from '../../rot-game/lib/camera'



describe('View', ()=> {
  var view, scene

  beforeEach( ()=> {
    var builder = new SceneBuilder('00')
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
          if (
            obj.hasOwnProperty(key) &&
            key.split(',').length == 2
          ) {
            size++
          }
        }
        return size;
      }
      view.display.draw = td.function('.draw')

      view._drawMap()

      td.verify(view.display.draw(), {
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
      view.display.draw = td.function('.draw')

      view._drawEntities()

      td.verify(view.display.draw(), {
        times: view.scene.entities().length,
        ignoreExtraArgs: true
      })
    })

    afterEach( ()=> {
      td.reset()
    })
  })

  describe('_createDisplay', ()=> {
    it('creates a ROT Display object', ()=> {
      var tempView = view
      tempView.display = null

      expect(tempView._createDisplay()).to.be.an.instanceof(ROT.Display)
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

import { expect } from 'chai'
import td from 'testdouble'
import { ROT } from '../../rot-game/lib/vendor/rot'
import { Camera } from '../../rot-game/lib/camera'
import { SceneBuilder } from '../../rot-game/lib/scene-builder'


describe('Camera', ()=> {
  var display, camera

  beforeEach( ()=> {
    var builder = new SceneBuilder('00')
    var player = builder.scene.player
    display = new ROT.Display()
    camera = new Camera(display, player, 'center')
  })

  describe('new', ()=> {
    it('has a display options object', ()=> {
      expect(camera.display).to.eq(display.getOptions())
    })

    it('has a subject with x and y coordinates', ()=> {
      expect(camera.subject.x, camera.subject.y).to.be.a('number')
    })

    it('has a mode', ()=> {
      expect(camera.mode).to.be.a('string')
    })

    it('has its own x and y coordinates', ()=> {
      expect(camera.x, camera.y).to.be.a('number')
    })
  })

  describe('update', ()=> {
    it('changes its subject if asked', ()=> {
      var oldSubject = camera.subject
      var newSubject = {x:1,y:1}

      camera.update(newSubject)

      expect(camera.subject).not.to.eq(oldSubject)
    })

    it('changes its mode if asked', ()=> {
      var oldMode = camera.mode
      var newMode = 'static'

      camera.update(camera.subject, newMode)

      expect(camera.mode).not.to.eq(oldMode)
    })

    describe('changes its coords based on its mode:', ()=> {
      it('center', ()=> {
        camera.mode = 'center'
        var expectedX = -camera.subject.x + Math.floor(camera.display.width/2)
        var expectedY = -camera.subject.y + Math.floor(camera.display.height/2)

        camera.update()

        expect(camera.x).to.eq(expectedX)
        expect(camera.y).to.eq(expectedY)
      })
    })
  })
})

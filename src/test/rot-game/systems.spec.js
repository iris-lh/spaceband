import { expect } from 'chai'
import td from 'testdouble'
import { Systems } from '../../rot-game/lib/systems'
import { SceneBuilder } from '../../rot-game/lib/scene-builder'
import { View } from '../../rot-game/lib/view'

describe('Systems', ()=> {
  var s

  beforeEach( ()=> {
    var scene  = new SceneBuilder('00').scene
    var view   = new View(scene)
    s          = new Systems(scene, view)
  })

  describe('new', ()=> {
    it('has a scene object', ()=> {
      expect(s.scene).to.be.an('object')
    })

    it('has a view object', ()=> {
      expect(s.view).to.be.an.instanceOf(View)
    })
  })

  describe('act', ()=> {
    var lock, fakeEngine

    beforeEach( ()=> {
      var lock = td.function('.lock')
      var fakeEngine = { lock: lock }
      s.engine = fakeEngine
    })

    it('locks the engine', ()=> {
      s.act()

      td.verify(s.engine.lock())
    })

    it('calls the renderer', ()=> {
      var render = td.function('.render')
      var fakeView = { render: render }
      s.view = fakeView

      s.act()

      td.verify(fakeView.render())
    })
  })

  describe('_moveEntities', ()=> {
    it('verifies that entity is an entity', ()=> {
      var entities = s.scene.entities()
      entities[0].dx = 1
      entities[0].dy = 1

      s._moveEntities()

      expect(entities[0].dx).to.eq(0)
      expect(entities[0].dy).to.eq(0)
    })
  })

  describe('_fetchTarget', ()=> {
    it('fetches the coords of an entity\'s target', ()=> {
      var entity = s.scene.entities()[0]

      var target = s._fetchTarget(entity.target)

      expect(target.x).to.be.a('number')
      expect(target.y).to.be.a('number')
    })
  })
})

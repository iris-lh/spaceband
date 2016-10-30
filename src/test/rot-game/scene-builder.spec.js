import { expect } from 'chai'
import td from 'testdouble'
import { SceneBuilder } from '../../rot-game/lib/scene-builder'



describe('SceneBuilder', ()=> {
  var sb
  beforeEach( ()=> {
    sb = new SceneBuilder('00')
  })

  describe('new', ()=> {
    it('has a scene', ()=> {
      expect(sb.scene).to.be.an('object')
    })

    it('has assets', ()=> {
      expect(sb.scene.assets).to.be.an('object')
    })

    it('has a level', ()=> {
      expect(sb.scene.level).to.be.an('object')
    })
  })
})

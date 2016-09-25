import { expect } from 'chai'
import td from 'testdouble'
import { SceneBuilder } from '../../rot-game/scene-builder'



describe('SceneBuilder', ()=> {
  var sb
  beforeEach( ()=> {
    sb = new SceneBuilder('00')
  })

  describe('new', ()=> {
    it('has a scene', ()=> {
      expect(sb.scene).to.be.an('object')
    })

    it('has a tileset', ()=> {
      expect(sb.scene.tiles).to.be.an('object')
    })

    it('has a level', ()=> {
      expect(sb.scene.level).to.be.an('object')
    })
  })
})

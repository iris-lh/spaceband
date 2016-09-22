import { expect } from "chai"
import { Scene } from "../../rot-game/scene"

describe('Scene', ()=> {
  var scene

  beforeEach( ()=> {
    scene = new Scene
  })

  describe('new', ()=> {

    it('has an empty map', ()=> {
      expect(scene.map).to.deep.eq({freeCells: []})
    })

    it('has an empty entities list', ()=> {
      expect(scene._entities).to.deep.eq([])
    })

  })

  describe('entities', ()=> {
    var player = { name: 'George' }

    it('returns them in reverse order', ()=> {
      scene.addEntity('1')
      scene.addEntity('2')
      scene.addPlayer(player)
      expect(scene.entities()).to.deep.eq(['2','1',player])
    })

    it('always returns the player last', ()=> {
      scene.addEntity('1')
      scene.addPlayer(player)
      scene.addEntity('2')
      expect(scene.entities()).to.deep.eq(['2','1',player])
    })

  })

})

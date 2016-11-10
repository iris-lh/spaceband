import { ROT } from './lib/vendor/rot'

export var cfg = {

  fontSize:   20,
  fontFamily: 'ModeNine',

  keyMap: {
    loadLevel:  76,
    resetLevel: 82,
    saveGame:   83,
    loadGame:   91
    dirs: [
      ROT.VK_UP,
      ROT.VK_PAGE_UP,
      ROT.VK_RIGHT,
      ROT.VK_PAGE_DOWN,
      ROT.VK_DOWN,
      ROT.VK_END,
      ROT.VK_LEFT,
      ROT.VK_HOME
    ],
    checkBoxKeys: [
      ROT.VK_RETURN,
      ROT.VK_SPACE
    ]
  }
}

import { ROT } from './vendor/rot'

export var cfg = {

  mapHeight:     50,
  mapWidth:      50,
  fontSize:      20,

  numOfBoxes:    5,

  pedroTopology: 4,
  pedroPathAlg:  ROT.Path.Dijkstra,

  keyMap: {
    dirs: {
             [ROT.VK_UP]: 0,
        [ROT.VK_PAGE_UP]: 1,
          [ROT.VK_RIGHT]: 2,
      [ROT.VK_PAGE_DOWN]: 3,
           [ROT.VK_DOWN]: 4,
            [ROT.VK_END]: 5,
           [ROT.VK_LEFT]: 6,
           [ROT.VK_HOME]: 7
    },
    checkBoxKeys: [
      ROT.VK_RETURN,
      ROT.VK_SPACE
    ]
  }
};

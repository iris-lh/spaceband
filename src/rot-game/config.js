import { ROT } from './rot'

export var cfg = {

  mapHeight:     40,
  mapWidth:      80,
  fontSize:      20,

  floorChar:     '\u22C5',
  floorFg:       '#999',
  floorBg:       '#111',

  playerChar:    '@',
  playerFg:      '#ff0',
  playerBg:      '#111',

  boxChar:       '\u2187',
  boxFg:         '#B84',
  boxBg:         '#111',
  numOfBoxes:    10,

  pedroChar:     '\u229A',
  pedroFg:       'red',
  pedroBg:       '#111',
  pedroTopology: 4,
  pedroPathAlg:  ROT.Path.Dijkstra

};



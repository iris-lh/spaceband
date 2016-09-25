import { ROT } from './vendor/rot'

export class Actor {
  constructor(tile, type, x, y, target) {
    this.isEntity = true
    this.tile = tile
    this.type = type
    this.x = x
    this.y = y

    this.dx = 0
    this.dy = 0

    this.target = target
    this.topology = 4
    this.pathAlg = ROT.Path.Dijkstra
  }
}

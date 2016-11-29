import { remote } from 'electron'
import { cfg }    from './../config'
import _          from 'lodash'

export var util = {
  gameWindow: function(displayType) {
    var w = remote.getCurrentWindow().getBounds();
    var factor = 1.0
    if(displayType == 'message') {
      factor = 0.665
    }
    var tileWidth = cfg[displayType].fontSize * factor
    var tileHeight = cfg[displayType].fontSize
    var widthInTiles = Math.floor(w.width / tileWidth)
    var heightInTiles = Math.floor(w.height / tileHeight - 1)
    return {
      width:       widthInTiles,
      height:      heightInTiles,
      pixelWidth:  w.width,
      pixelHeight: w.height,
      remainder: {
        width: w.width - (tileWidth * widthInTiles),
        height: w.height - (tileHeight * heightInTiles)
      }
    }
  },

  setupResizeListener: function(listener) {
    let currentWindow = remote.getCurrentWindow().removeAllListeners()
    currentWindow.on('resize', _.debounce(listener, 100))
  },

  hypoteneuse: function(a, b) {
    var c2 = a*a + b*b
    return Math.sqrt(c2)
  }
}

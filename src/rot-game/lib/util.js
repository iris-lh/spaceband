import { remote } from 'electron'
import { cfg }    from './config'
import _          from 'lodash'

export var util = {
  gameWindow: function() {
    var w = remote.getCurrentWindow().getBounds();
    return {
      width:       Math.floor(w.width / cfg.fontSize),
      height:      Math.floor(w.height / cfg.fontSize) - 2,
      pixelWidth:  w.width,
      pixelHeight: w.height
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

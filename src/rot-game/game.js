import { ROT } from './rot'



function newUUID(){
  var d = new Date().getTime();
  if(window.performance && typeof window.performance.now === "function"){
    d += performance.now(); //use high-precision timer if available
  }
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
}

var testID = newUUID();
console.log(testID);



var cfg = {

  mapHeight:     40,
  mapWidth:      80,
  fontSize:      20,

  floorChar:     "\u22C5",
  floorFg:       "#999",
  floorBg:       "#111",

  playerChar:    "@",
  playerFg:      "#ff0",
  playerBg:      "#111",

  boxChar:       "\u2187",
  boxFg:         "#B84",
  boxBg:         "#111",
  numOfBoxes:    10,

  pedroChar:     "\u229A",
  pedroFg:       "red",
  pedroBg:       "#111",
  pedroTopology: 4,
  pedroPathAlg:  ROT.Path.Dijkstra

};


var cmp = {
  giveName: function(ent, _name='') {
    ent[name] = _name;
  },
  giveType: function(ent, _type='') {
    ent[type] = _type;
  },
  giveForm: function(ent, _char='', _fg=null, _bg=null) {
    ent[char] = _char;
    ent[fg] = _fg;
    ent[bg] = _bg;
  },
  giveControls: function(ent, _controlMap) {
    ent[ctrl] = _controlMap;
  },
  givePathing: function(ent, _pathAlg, _pathTopology) {
    ent[pathAlg] = _pathAlg;
    ent[pathTopology] = _pathTopology;
  }
};

createPlayer = function() {
  ent = newUUID();
  entities[ent] = {};
  giveName(entities[ent], "Player");
  giveType(entities[ent], "actor");
  giveForm(entities[ent], "@", playerFg, playerFg);
  giveControls(entities[ent], controlMap);
};

createPedro = function() {
  ent = newUUID();
  entities[ent] = {};
  giveName(entities[ent], "Pedro");
  giveType(entities[ent], "actor");
  giveForm(entities[ent], pedroChar, pedroFg, pedroFg);
  givePathing(entities[ent], pedroPathAlg, pedroTopology);
};


var tiles = {
  floor: {
    char: cfg.floorChar,
    fg:   cfg.floorFg,
    bg:   cfg.floorBg
  },
  box: {
    char: cfg.boxChar,
    fg:   cfg.boxFg,
    bg:   cfg.boxBg
  },
  pedro: {
    char: cfg.pedroChar,
    fg:   cfg.pedroFg,
    bg:   cfg.pedroBg
  },
  player: {
    char: cfg.playerChar,
    fg:   cfg.playerFg,
    bg:   cfg.playerBg
  }
};

export var Game = {
  display: null,
  map: {},
  engine: null,
  player: null,
  pedro: null,
  ananas: null,

  entities: {},

  init: function(electronRemote) {
    this.app = electronRemote;
    var win = this._gameWindow();
    this.display = new ROT.Display({
      width:            win.width,
      height:           win.height,
      spacing:          1,
      forceSquareRatio: true,
      fontSize:         cfg.fontSize,
      fg:               cfg.floorFg
    });
    document.body.appendChild(this.display.getContainer());

    this._generateMap();

    var scheduler = new ROT.Scheduler.Simple();
    scheduler.add(this.player, true);
    scheduler.add(this.pedro, true);

    this.engine = new ROT.Engine(scheduler);
    this.engine.start();
  },

  _gameWindow: function() {
    var gameWindow = this.app.getCurrentWindow().getBounds();
    return {
      width: Math.floor(gameWindow.width / cfg.fontSize),
      height: Math.floor(gameWindow.height / cfg.fontSize),
      pixelWidth: gameWindow.width,
      pixelHeight: gameWindow.height
    };
  },

  _drawTile: function(x, y, tile) {
    this.display.draw(x, y, tile.char, tile.fg, tile.bg);
  },

  _generateMap: function() {
    var win = this._gameWindow();
    var digger = new ROT.Map.Digger(win.width, win.height);
    var freeCells = [];

    var digCallback = function(x, y, value) {
        if (value) { return; }

      var key = x+","+y;
      this.map[key] = tiles.floor;
      freeCells.push(key);
    }
    digger.create(digCallback.bind(this));

    this._generateBoxes(freeCells);
    this._drawWholeMap();

    this.player = this._createActor(Player, freeCells);
    this.pedro = this._createActor(Pedro, freeCells);
  },

  _createActor: function(what, freeCells) {
    var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
    var key = freeCells.splice(index, 1)[0];
    var parts = key.split(",");
    var x = parseInt(parts[0]);
    var y = parseInt(parts[1]);
    return new what(x, y);
  },

  _generateBoxes: function(freeCells) {
    for (var i=0;i<cfg.numOfBoxes;i++) {
      var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
      var key = freeCells.splice(index, 1)[0];
      this.map[key] = tiles.box;
      if (!i) { this.ananas = key; } /* first box contains an ananas */
    }
  },

  _drawWholeMap: function() {
    for (var key in this.map) {
      var parts = key.split(",");
      var x = parseInt(parts[0]);
      var y = parseInt(parts[1]);
      if (this.map[key].char == tiles.box.char) {
        //this.display.draw(x, y, this.map[key], cfg.boxFg, cfg.floorBg);
        this._drawTile(x, y, tiles.box);
      } else {
        //this.display.draw(x, y, this.`map`[key], cfg.floorFg, cfg.floorBg);
        this._drawTile(x, y, this.map[key]);
      }
    }
  }
};

var Player = function(x, y) {
  this._x = x;
  this._y = y;
  this._draw();
}

Player.prototype.getSpeed = function() { return 100; }
Player.prototype.getX = function() { return this._x; }
Player.prototype.getY = function() { return this._y; }

Player.prototype.act = function() {
  Game.engine.lock();
  window.addEventListener("keydown", this);
}

Player.prototype.handleEvent = function(e) {
  var code = e.keyCode;
  if (code == 13 || code == 32) {
      this._checkBox();
      return;
  }

  var keyMap = {};
  keyMap[38] = 0;
  keyMap[33] = 1;
  keyMap[39] = 2;
  keyMap[34] = 3;
  keyMap[40] = 4;
  keyMap[35] = 5;
  keyMap[37] = 6;
  keyMap[36] = 7;

  /* one of numpad directions? */
  if (!(code in keyMap)) { return; }

  /* is there a free space? */
  var dir = ROT.DIRS[8][keyMap[code]];
  var newX = this._x + dir[0];
  var newY = this._y + dir[1];
  var newKey = newX + "," + newY;
  if (!(newKey in Game.map)) { return; }

  //put the floor back where it was
  var coordinates = this._x + "," + this._y;
  if (Game.map[coordinates] == cfg.boxChar) {
    //Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y], cfg.boxFg, cfg.floorBg);
    Game._drawTile(this._x, this._y, Game.map[coordinates])
  } else {
    //Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y], cfg.floorFg, cfg.floorBg);
    Game._drawTile(this._x, this._y, Game.map[coordinates]);
  }

  this._x = newX;
  this._y = newY;
  this._draw();
  window.removeEventListener("keydown", this);
  Game.engine.unlock();
}

Player.prototype._draw = function() {
  //Game.display.draw(this._x, this._y, cfg.playerChar, cfg.playerFg, cfg.playerBg);
  Game._drawTile(this._x, this._y, tiles.player);
}

Player.prototype._checkBox = function() {
  var key = this._x + "," + this._y;
  if (Game.map[key].char != tiles.box.char) {
    alert("There is no box here!");
  } else if (key == Game.ananas) {
    alert("Hooray! You found an ananas and won this game.");
    Game.engine.lock();
    window.removeEventListener("keydown", this);
  } else {
    alert("This box is empty :-(");
  }
}

var Pedro = function(x, y) {
  this._x = x;
  this._y = y;
  this._draw();
}

Pedro.prototype.getSpeed = function() { return 100; }

Pedro.prototype.act = function() {
  var x = Game.player.getX();
  var y = Game.player.getY();

  var passableCallback = function(x, y) {
      return (x+","+y in Game.map);
  }
  var pather = new cfg.pedroPathAlg(x, y, passableCallback, {topology:cfg.pedroTopology});

  var path = [];
  var pathCallback = function(x, y) {
      path.push([x, y]);
  }
  pather.compute(this._x, this._y, pathCallback);

  path.shift();
  if (path.length <= 1) {
    this._draw();
    Game.engine.lock();
    alert("Game over - you were captured by Pedro!");
  } else {
    x = path[0][0];
    y = path[0][1];

    //put the floor back where it was
    var coordinates = this._x + "," + this._y;
    if (Game.map[coordinates].char == tiles.box.char) {
      //Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y], cfg.boxFg, cfg.floorBg);
      Game._drawTile(this._x, this._y, Game.map[coordinates]);
    } else {
      //Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y], cfg.floorFg, cfg.floorBg);
      Game._drawTile(this._x, this._y, Game.map[coordinates]);
    }

    this._x = x;
    this._y = y;
    this._draw();
  }
}

Pedro.prototype._draw = function() {
  Game._drawTile(this._x, this._y, tiles.pedro);
}

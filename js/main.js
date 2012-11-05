// Generated by CoffeeScript 1.4.0
var app, barry, farbg, game, midbg, mummy_tile, scenario, shotgun_tile,
  _this = this;

farbg = {
  w: 512,
  h: 512,
  imgW: 512,
  imgH: 512,
  startX: 0,
  startY: 0
};

midbg = {
  w: 800,
  h: 512,
  imgW: 512,
  imgH: 512,
  startX: 0,
  startY: 0
};

barry = {
  x: 8,
  y: 8,
  w: 32,
  h: 32,
  startX: 0,
  startY: 0,
  partW: 8 * 32,
  partH: 8 * 32,
  stretchW: 64,
  stretchH: 64
};

mummy_tile = {
  x: 8,
  y: 8,
  w: 32,
  h: 32,
  startX: 0,
  startY: 0,
  partW: 8 * 32,
  partH: 8 * 32,
  stretchW: 64,
  stretchH: 64
};

shotgun_tile = {
  x: 8,
  y: 1,
  w: 64,
  h: 32,
  startX: 0,
  startY: 0,
  partW: 8 * 64,
  partH: 1 * 32
};

app = new App();

app.startCycle(true);

app.fullScreenOn();

app.canvas = new Canvas(app, "canvas", 512, 512);

app.event = new Event();

game = function() {
  return this;
};

game.start = function() {
  var _this = this;
  this.farBg = new Node();
  this.farBg.addSquare(0, 0, 0, 0);
  this.farBg.addTexture(farbg, app.farbg);
  this.farBg.animateTexture(1, 0, 3, -1);
  this.farBg.drawTexture(null, null, app.canvas);
  this.midBg = new Node();
  this.midBg.addSquare(0, 0, 0, 0);
  this.midBg.addTexture(midbg, app.midbg);
  this.midBg.animateTexture(1.5, 0, 1, -1);
  this.midBg.drawTexture(null, null, app.canvas);
  this.h = new Node();
  this.h.addSquare(32, 32, -100, -110);
  this.h.addTile(barry, app.barry);
  this.h.animateTile(0, 7, false, 4, -1);
  this.h.slideTo(100, 300, 20);
  this.h.drawTile(null, null, app.canvas);
  this.h._shoot = pubsub.subscribe("mousedown", function() {
    if (_this.shoot) {
      _this.shoot.kill();
    }
    _this.shoot = new Node();
    _this.shoot.addSquare(64, 32, 0, 0);
    _this.shoot.addTile(shotgun_tile, app.shotgun);
    _this.shoot.drawTile(null, null, app.canvas);
    _this.shoot.follow(_this.h, 2, 60, 30);
    return _this.shoot.animateTile(0, 7, false, 2, 1, (function() {
      return _this.shoot.kill();
    }));
  });
  this.h._jumpYGravity = 1;
  return this.h._jump = pubsub.subscribe("up", function() {
    _this.h.animateTile(40, 47, false, 4, 1, (function() {
      return _this.h.animateTile(48, 55, false, 4, 1);
    }));
    return _this.h.jumpY(-20, _this.h._jumpYGravity, function() {
      return _this.h.animateTile(0, 6, false, 4, -1);
    });
  });
};

game.play = function() {
  var _this = this;
  this.enemies = new Collection();
  this.enemies._spawn = this.enemies.addCycle(60, -1, function() {
    var node;
    node = new Node();
    node.addSquare(32, 32, 300, 300);
    node.addTile(mummy_tile, app.mummy);
    node.animateTile(0, 7, false, 4, -1);
    node.drawTile(null, null, app.canvas);
    return _this.enemies.add(node);
  });
  return this.enemies._move = this.enemies.addCycle(1, -1, function() {
    _this.enemies.each(function(elem) {
      elem.move(-2, 0);
      if (elem.square.xx <= 0) {
        return elem.killTile();
      }
    });
    if (_this.h) {
      _this.enemies.squareCollision(_this.h.square, function(elem) {
        return elem.killTile();
      });
    }
    if (_this.shoot) {
      return _this.enemies.squareCollision(_this.shoot.square, function(elem) {
        return elem.killTile();
      });
    }
  });
};

scenario = [
  {
    exec: function() {
      return game.start();
    },
    print: true,
    sleep: 250,
    tmpSleep: 25,
    txt: "Are you ready baby",
    x: 250,
    y: 450,
    bgColor: "#fff",
    txtColor: "#000",
    fontFamily: "Arial",
    fontSize: "30"
  }, {
    exec: function() {
      return game.play();
    }
  }
];

app.loadImages([
  {
    name: "barry",
    src: "img/barryfull.png"
  }, {
    name: "shotgun",
    src: "img/shotgun.png"
  }, {
    name: "midbg",
    src: "img/egyptmidbg_01.png"
  }, {
    name: "farbg",
    src: "img/egyptfarbg.png"
  }, {
    name: "egyptwall1",
    src: "img/egyptwall.png"
  }, {
    name: "egyptwall2",
    src: "img/egyptwall2.png"
  }, {
    name: "mummy",
    src: "img/mummyfull.png"
  }
], function() {
  var reader;
  reader = new Reader(scenario, app.canvas);
  return reader.read();
});
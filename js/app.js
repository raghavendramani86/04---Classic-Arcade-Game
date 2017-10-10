// Define Art Asset source
  var source = [
    "img/images/water-block.png",
    "img/images/stone-block.png",
    "img/images/grass-block.png",
    "img/images/char-cat-girl.png",
    "img/images/enemy-bug.png",
    "img/images/enemy-bug-rev.png",
    "img/images/char-boy.png",
    "img/images/star.png",
  ];
  var grid = [
    "img/images/stone-block.png",
    "img/images/stone-block.png",
    "img/images/water-block.png",
    "img/images/grass-block.png",
    "img/images/stone-block.png",
    "img/images/stone-block.png",
    "img/images/stone-block.png",
    "img/images/grass-block.png"
  ];

// Declare Game Object
var game = new Engine();

// Assign properties
  // Build layout
  game.canvas = loadCanvas(560,680);
  // load all images to cache
  game.cache = loadImages(source);
  // prepare game callback on load completion
  prepCallBack(game.begin);
  // assign valid keys
  game.keys = [37,38,39,40];
// initialize game
function init() {
  game.buildWorld(grid,7,8,80);
  game.display();
  game.render();
  game.animation.push(requestAnimationFrame(init));
}

// Player Class
class Player {
  constructor(x,y,path,speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.image= path;
    game.activeObjects.push(this);
  }
  render() {
    place(this.image,this.x,this.y);
  }
  move(code) {
    switch (code) {
      case 37:
      this.x -= this.speed;
        break;
      case 38:
      this.y -= this.speed;
        break;
      case 39:
      this.x += this.speed;
        break;
      case 40:
      this.y += this.speed;
        break;
        // automatic Movement
      case 45:
      this.x += this.speed;
        break;
      case 50:
      this.x -= this.speed;
        break;
    }
  }
  cleanUp() {
    var index = game.activeObjects.indexOf(this);
    game.activeObjects[index] = null;
    game.activeObjects.splice(index,1);
  }
  reset(x,y) {
    this.x = x;
    this.y = y;
  }
}
// Enemy Class
class Enemy extends Player {
  constructor(x,y,path,speed,number) {
    super(x,y,path,speed);
    game.activeEnemies.push(this);
  }
  render() {
    super.render();
  }
  move(code) {
    super.move(code);
  }
  cleanUp() {
    // prepare unused objects for GC
    super.cleanUp();
    var index = game.activeEnemies.indexOf(this);
    game.activeEnemies[index] = null;
    game.activeEnemies.splice(index,1);
  }
}

// instantiate heroes
var hero = game.generateEntities(true,false,190,500,"img/images/char-boy.png",55);
var hero2 = game.generateEntities(true,false,game.canvas[0].width*0.80,170,"img/images/char-cat-girl.png",0);
// instantiate enemies
// starter enemies
game.generateEntities(false,false,game.canvas[0].width/2,250,"img/images/enemy-bug-rev.png",10);
game.generateEntities(false,false,150,330,"img/images/enemy-bug.png",10);
game.generateEntities(false,false,game.canvas[0].width/3,410,"img/images/enemy-bug-rev.png",10);
// bulk enemies
if (!game.pause) { //in case game starts without user input
  game.generateEntities(false,true);
  game.autoMove();
}

// watch input
$('body').on('keydown',keyWatcher);
$('body').on('keyup',setKeyUp);

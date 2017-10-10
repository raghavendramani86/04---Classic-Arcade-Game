
//Game engine

  /* This is the Engine class and provides all the
  properties and methods associated with this game
  engine.

  This class has to be instantiated in order to run
  this game successfully.
  */
  class Engine {
    /* class constructor assigns all the class default
    properties to the instantiating objects
    */
    constructor() {
      // assign properties
      this.canvas = [];
      this.cache = [];
      this.callBack = [];
      this.activeObjects = [];
      this.activeEnemies = [];
      this.generate = '';
      this.move = '';
      this.animation = [];
      this.pause = true;
      this.keys = [];
      this.keyPress = false;
      this.score = 0;
      this.tries = 1;
      this.message = 'Press Enter to start!';
      this.medal = false;
    }
    // methods

    /* global access method that triggers the initialization
    of this class and the remaining methods throughout the
    execution of the game
    */
    begin(grid) {
      init();
    }
    /*This method interacts with the user at appropriate
    times during game execution

    this actively updated the game status, score and other
    run-time details during gameplay
    */
    display() {
      // game title
      this.canvas[1].font = "30px Arial";
      this.canvas[1].fillText('Classic Arcade Game',10,40);
      this.canvas[1].font = "20px Arial";
      this.canvas[1].fillText('- build with ECMAScript 6',10,65);
      this.canvas[1].fillText('- Game Engine by Raghavendra Mani',220,this.canvas[0].height-10);
      // game status
      this.canvas[1].font = "20px Arial";
      this.canvas[1].fillText('Active Monsters: '+this.activeEnemies.length,this.canvas[0].width*0.6,25);
      this.canvas[1].fillText('Game status: '+this.status(),this.canvas[0].width*0.6,50);
      this.canvas[1].fillText('Moves: '+this.score,this.canvas[0].width*0.6,75);
      this.canvas[1].fillText('Tries: '+this.tries,this.canvas[0].width*0.8,75);
      // game instructions
      this.instructions();
      // warning messages
      this.warning();
    }

    /* This method builds the layout of the game.
    parameters: layout in the form of an array of images paths,
    rows, columns to define the grid dimensions and imageFactor
    to control the placement of each image relative to the other
    images
    */
    buildWorld(layout,rows,cols,imageFactor) {
      for (var i = 0; i <=rows; i++) {
        for (var j = 0; j <=cols; j++) {
          if (imageFactor) {
            this.canvas[1].drawImage(this.cache[layout[i]],j*imageFactor ,i*imageFactor);
          }
          else {
            this.canvas[1].drawImage(this.cache[layout[i]],j*1 ,i*1);
          }
        }
      }
    }
    /* This function calls the render methods of all the objects
    or entities existing in the game. Each entity class should
    implement its own render method in order for this method to
    work
    */
    render() {
      this.activeObjects.forEach(function(object) {
        object.render();
      })
    }
    /*Generic method used to generate all entities involved in the
    game.
    Parameters:
    player - true or false flag that defines if an entity is a player
    or enemy
    bull - true or false flag that defines whether bulk entity generation
    is required
    x,y - coordinates of the starting position of each entity
    path - image path of the entity
    speed - rate of motion of the entity. (in case of bulk entities this is
    set to a common value for all entities)
    */
    generateEntities(player,bulk,x,y,path,speed) {
      if (player) { // generating single players
        return new Player(x,y,path,speed);
      }
      else {
        if (bulk) { // generating multiple enemies
          var val = 1;
          /*reassigning this as the reference is
          lost within functions*/
          var engine=this;
          /*
          Regulates the range of enemy generation
          to control unplayable number of enemies on
          screen
          */
          var range = buildRandomSequence(250,500,500)[0]
          this.generate = setInterval(function() {
            if (val===1) {
              new Enemy(engine.canvas[0].width,250,"img/images/enemy-bug-rev.png",10);
            }
            if (val===2) {
              new Enemy(0,330,"img/images/enemy-bug.png",10);
            }
            if (val===3) {
              new Enemy(engine.canvas[0].width,410,"img/images/enemy-bug-rev.png",10);
            }
            val = shuffleArray(buildRandomSequence(1,4,3))[0];
          },range)
        }
        else { // generating single enemy
          new Enemy(x,y,path,speed);
        }
      }
    }
    /* This method picks up entities created in the generateEntities method
    and starts moving them automatically based on their speed setting.
    */
    autoMove() {
      var engine=this;
      this.move = setInterval(function() {
        engine.activeEnemies.forEach(function(enemy) {
          if (enemy.image==="img/images/enemy-bug.png") {
            enemy.move(45);
          }
          else if (enemy.image==="img/images/enemy-bug-rev.png") {
            enemy.move(50);
          }
          else {
            enemy.move(45);
          }
          checkCollision();
        })
      },30);
    }
    /* Method to start game execution*/
    go() {
      if (game.pause===true) {
        game.message = '';
        game.pause=false;
        game.generateEntities(false,true);
        game.autoMove();
        console.log('Game Status: ', game.status());
      }
    }
    /* Method to pause/stop game execution*/
    stop() {
      if (!this.pause) {
        game.message = 'Press Enter to continue!';
        this.pause=true;
        clearInterval(this.move);
        clearInterval(this.generate);
        console.clear();
        console.log('Game Status: ',this.status(),'\nAll Objects',this.activeObjects, '\nMonsters',this.activeEnemies);
      }
    }
    /*This method returns the current status of game execution*/
    status() {
      return this.pause?'Paused':'Active';
    }
    /* Method to feed the display method with instructions for
    the game
    */
    instructions() {
      this.canvas[1].font = "20px Arial";
      this.canvas[1].fillText('Goal: Avoid the monsters. Reach the princess.',10,105);
    }
    /* Method to feed the display method with warnings for
    the game
    */
    warning() {
      this.canvas[1].font = "20px Arial";
      this.canvas[1].fillText(this.message,10,130);
    }
    /* This method determines and displays the appropriate
    start rating for the game based on player performance
    */
    medals() {
      if (this.medal) {
        if (this.score<50&&this.tries<10) {
          place("img/images/star.png",70,100);
        }
        if(this.score<40&&this.tries<8) {
          place("img/images/star.png",150,100);
        }
        if (this.score<30&&this.tries<6) {
          place("img/images/star.png",230,100);
        }
        if (this.score<20&&this.tries<4) {
          place("img/images/star.png",320,100);
        }
        if (this.score<15&&this.tries<2) {
          place("img/images/star.png",400,100);
        }
      }
    }
    /* Method to feed the display method with ending
    message for the game
    */
    endMessage() {
      this.canvas[1].font = "20px Arial";
      this.canvas[1].strokeText("You Won!!.",10,135)
      this.canvas[1].fillText("You Won!!.",10,135)

      this.canvas[1].strokeText("End!!, Thank you for playing.",10,this.canvas[0].height-50)
      this.canvas[1].fillText("End!!, Thank you for playing.",10,this.canvas[0].height-50);
    }
    /* This method controls the following end activities of the game:
    - display medals if any
    - display end message
    - call cleanUp method
    - call garbage collection method
    */
    end() {
      this.medals();
      this.endMessage();
      this.cleanUp();
      this.gc();
    }
    /* This method performs clean up of all the objects
    created during game execution. This includes:
    - removing objects from the player and enemy arrays
    - clearing the game loop interval
    */
    cleanUp() {
      // clear activeEnemies
      this.activeEnemies.forEach(function(enemy) {
        enemy.cleanUp();
      });
      // clear active players
      this.activeObjects.forEach(function(object) {
        object.cleanUp();
      });
      // stop game loop
      this.animation.forEach(function(frame,index) {
        cancelAnimationFrame(frame);
      });
    }
    /*This function clears all the remaining objects
    and prepares them for garbage collection after
    the cleanUp method has finished.
    */
    gc() {
      // clear all arrays
      this.animation=null;
      this.keys=null;
      // clear variables
      this.generate=null;
      this.move=null;
    }
  };

// Supporting functions to the game engine
  /* This function creates a canvas HTML
  element of the specified dimensions
  and returns an array containing the
  canvas and its context.

  The function also draws a border around
  the canvas to show on screen.

  Parameters: width,height as number of pixels
  */
  function loadCanvas(width,height) {
    $('body').prepend('<canvas class=canvas>');
    // create context
    var canvas = document.querySelector('.canvas');
    var ctx = canvas.getContext('2d');
    // set dimensions
    canvas.width = width;
    canvas.height = height;
    // draw border
    ctx.strokeRect(0,0,width,height);
    return [canvas,ctx];
  }
  /* This function accepts an array of
  image urls, loads all the images and
  returns an array of image objects.

  This function internally calls the
  cacheImages function to perform the
  cacheing.
  parameters: arrays of images
  */
  function loadImages(array) {
    var cache=[];
    array.forEach(function(path) {
      // load image into cache
      cache[path] = cacheImages(path);
    });
    return cache;
  }
  /* This function is called by loadImages
  to perform cacheing of image urls and load
  image objects
  */
  function cacheImages(path) {
    var img = new Image();
    img.onload = function () {
      if(loadDone()) {
        game.callBack.forEach(function(func) {
          func();
        });
      }
    };
    img.src = path;
    return img;
  }
  /* This function prepares the callback
  function while images are being loaded
  */
  function prepCallBack(func) {
    game.callBack.push(func);
  }
  /* This function returns the image object
  for a path/url from within the loaded
  images cache.

  parameters: path/url of image
  */
  function getImage(path) {
    // if image does not exist, load it and then return
    if (game.cache[path]===undefined) {
      cacheImages(path)
    }
    return game.cache[path];
  }
  /* This function returns a confirmation when
   images have been successfully loaded into
   the image cache
   */
  function loadDone() {
    return true;
  }
  /*This function places an image at the specified
  coordinates on a canvas
  parameters: path, x coordinate, y coordinates
  */
  function place(path,x,y) {
    game.canvas[1].drawImage(getImage(path),x ,y);
  }

  function keyWatcher() {
    if (game.keys!==null) {
      // un-pause game on Enter
      if (event.keyCode===13) {
        game.go();
      }
      // pause game on escape
      if (event.keyCode===27) {
        game.stop();
      }
      if (game.keys.includes(event.keyCode)) {
        /*
        Check keyup event on the arrow keys to
        ensure that user does not long press on
        any one direction to skip monsters
        */
        if (!game.keyPress&&!game.pause) {
          game.message = '';
          game.keyPress = true;
          game.score++;
          hero.move(event.keyCode);
          checkCollision();
        }
        else {
          if (!game.pause) {
            game.message = 'Long press is not allowed. Try clicking the keys!';
          }
        }
      }
    }
  }
  /* This function checks for the following collisions durin
  game play:
  - enemies and players
  - enemies with layout
  - players with layout
  - players with end conditions
  */
  function checkCollision() {
    // enemies with layout
    game.activeEnemies.forEach(function(enemy) {
      enemy.x = enemy.x>game.canvas[0].width?enemy.cleanUp():enemy.x;
      enemy.x = enemy.x<-75?enemy.cleanUp():enemy.x;
      // enemies with hero
      if ((enemy.x>=hero.x-20&&enemy.x<hero.x+40)&&(enemy.y>=hero.y-40&&enemy.y<hero.y+40)) {
        hero.reset(190,500);
        game.tries++;
      }
    });
    // hero with layout
    hero.x = hero.x>(game.canvas[0].width-100)?(game.canvas[0].width-100):hero.x;
    hero.x = hero.x<0?0:hero.x;
    hero.y = hero.y>game.canvas[0].height-150?(game.canvas[0].height-150):hero.y;
    hero.y = hero.y<150?150:hero.y;
    if (hero.x>=hero2.x&&hero.y<=hero2.y) {
      game.medal = true;
      game.stop();
      end();
    }
  }
  /* This method triggers the end of the game
  */
  function end() {
    game.end();
    console.log('End!!, thank you for playing');
  }
  /* This method is used to check when a key press
  has been completed
  */
  function setKeyUp() {
    game.keyPress=false;
  }

// Helper function
  /*This function creates a random sequence of numbers
  accepting a minimum, maximum and range of numbers as
  parameters*/
  function buildRandomSequence(min, max,range) {
    min = Math.ceil(min);
    max = Math.floor(max);
    var randomArray = [];
    var value;
    for (var i = 0; i < (max-min); i++) {
      value = Math.floor(Math.random() * range)+min;
      if (randomArray.indexOf(value)===-1) {
        randomArray.push(value);
      }
      else {
        i--;
      }
    }
    return randomArray;
  }
  /* This function randomly shuffles any array and returns
  the shuffled array
  */
  function shuffleArray(array) {
    var shuffle = buildRandomSequence(0,array.length,array.length);
    var newArray = [];
    for (var i = 0; i < array.length; i++) {
      newArray.push(array[shuffle[i]]);
    }
    return newArray;
  }
  /* This function watches for keystrokes during gameplay
  and performs specific action for each keystroke associated
  with the game.
  */

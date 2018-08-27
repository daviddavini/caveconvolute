console.log("didn't get stuck defining stuff");

document.fonts.load("10pt ArcadeClassic").then(loadAssets);
var assetManager = new AssetManager();
function loadAssets(){
  assetManager.loadImages();
  assetManager.onLoad(main);
}

function printFPS(fps, fpsExpected){
  ctx.fillStyle = "blue";
  ctx.font = "20px Arial";
  ctx.fillText((""+(fps).toFixed(0)+" |  "+ (fpsExpected).toFixed(0)),10+INVWIDTH,40);
}
function getDt(timeOfLastLoop){
  var dt = (performance.now()-timeOfLastLoop)/1000;  //in seconds
  if(dt > 0.25){
    dt = 0.25;
    console.log("dt too high, fixing");
  }
  return dt
}
function toggleDebugMode(){
  DEBUG = !DEBUG;
  if(DEBUG) {
    NOWWINDOWSIZE = DEBUGWINDOWSIZE; //area that can be seen in the window at once
    BACKCOLOR = "lightyellow";
    FSIZE = CSIZE/NOWWINDOWSIZE;
  } else {
    NOWWINDOWSIZE = GAMEWINDOWSIZE;
    BACKCOLOR = "black";
    FSIZE = CSIZE/NOWWINDOWSIZE;
  }
}

function main(){
  var screen = new TitleScreen(new Vector(0,0), new Vector(ctx.canvas.width, ctx.canvas.height), socket);

  var timeOfLastLoop = performance.now();
  var dtExpected = 1/FPS;
  var dt = dtExpected;
  var printedFPS = 1/dt;
  var printedFPSCount = 0;
  var printedFPSTime = 0.1;

  ctx.textBaseline="middle";

  setInterval(function(){
    //ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    screen.update(dt);
    if(screen.followScreen){
      screen = screen.followScreen;
    }
    screen.draw(ctx);

    printedFPSCount += dt;
    if(printedFPSCount >= printedFPSTime){
      printedFPS = 1/dt;
      printedFPSCount = 0;
    }
    if(DEBUGSTATS)
      printFPS(printedFPS, FPS);
    dt = getDt(timeOfLastLoop);

    timeOfLastLoop = performance.now();
  }, 1000/FPS);

  document.onmousewheel = function(event) {
    InputMove.keyPress({type:"inventoryToggle", change:event.deltaY});
    return false;
  };

  var mouseDown = false;
  function whileMouseDown(event){
    var rect = canvas.getBoundingClientRect();
    var mousePos = new Vector((event.clientX - rect.x - ctx.canvas.width/2 - INVWIDTH/2)/FSIZE,
                          (event.clientY - rect.y - ctx.canvas.height/2)/FSIZE);

    InputMove.keyPress({type:"throw", state:true, mousePos:mousePos});
  }
  document.oncontextmenu = function(event){
    event.preventDefault();
  };
  document.onmousedown = function(event){
    event.preventDefault();
    if(event.button === 0){
      mouseDown = true;
      whileMouseDown(event);
    } else if(event.button === 2){
      InputMove.keyPress({type:"grab", state:true});
    }
  };
  document.onmousemove = function(event){
    if(event.button === 0){
      if(mouseDown){
        whileMouseDown(event);
      }
    }
  }
  document.onmouseup = function(event){
    event.preventDefault();

    if(event.button === 0){
      mouseDown = false;

      var rect = canvas.getBoundingClientRect();
      var mousePos = new Vector((event.clientX - rect.x - ctx.canvas.width/2 - INVWIDTH/2)/FSIZE,
                            (event.clientY - rect.y - ctx.canvas.height/2)/FSIZE);

      InputMove.keyPress({type:"throw", state:false, mousePos:mousePos});
    } else if(event.button === 2){
      console.log("yee");
      InputMove.keyPress({type:"grab", state:false});
    }
  };
  document.onkeydown = function(event){
    //event.preventDefault();
    //console.log(event.keyCode);
    if(event.keyCode === 68) // d
      InputMove.keyPress({type:"move",inputId:"moveRight",state:true});
    if(event.keyCode === 83) // s
      InputMove.keyPress({type:"move",inputId:"moveDown",state:true});
    if(event.keyCode === 65) // a
      InputMove.keyPress({type:"move",inputId:"moveLeft",state:true});
    if(event.keyCode === 87) // w
      InputMove.keyPress({type:"move",inputId:"moveUp",state:true});
    if(event.keyCode === 16) // shift
      InputMove.keyPress({type:"speed",state:true});
    if(event.keyCode === 16) // shift
      InputMove.keyPress({type:"speed",state:true});
    var s = 50;
    if(event.keyCode === 39){ // d
      X += s;
      //InputMove.keyPress({type:"throw",inputId:"throwRight",state:true});
    }
    if(event.keyCode === 40){ // s
      Y += s;
      //InputMove.keyPress({type:"throw",inputId:"throwDown",state:true});
    }
    if(event.keyCode === 37){ // a
      X -= s;
      //InputMove.keyPress({type:"throw",inputId:"throwLeft",state:true});
    }
    if(event.keyCode === 38){ // w
      Y -= s;
      //InputMove.keyPress({type:"throw",inputId:"throwUp",state:true});
    }
    if(event.keyCode === 72){ // h
      toggleDebugMode();
    }
    if(event.keyCode === 81){ // h
      DEBUGSTATS = !DEBUGSTATS;
    }
    if(event.keyCode === 66) // h
      DEBUGBOX = !DEBUGBOX;
  }
  document.onkeyup = function(event){
    event.preventDefault();
    if(event.keyCode === 68) // d
      InputMove.keyPress({type:"move",inputId:"moveRight",state:false});
    if(event.keyCode === 83) // s
      InputMove.keyPress({type:"move",inputId:"moveDown",state:false});
    if(event.keyCode === 65) // a
      InputMove.keyPress({type:"move",inputId:"moveLeft",state:false});
    if(event.keyCode === 87) // w
      InputMove.keyPress({type:"move",inputId:"moveUp",state:false});
    if(event.keyCode === 16) // shift
      InputMove.keyPress({type:"speed",state:false});
    if(event.keyCode === 39){ // d
      //InputMove.keyPress({type:"throw",inputId:"throwRight",state:false});
    }
    if(event.keyCode === 40){ // s
      //InputMove.keyPress({type:"throw",inputId:"throwDown",state:false});
    }
    if(event.keyCode === 37){ // a
      //InputMove.keyPress({type:"throw",inputId:"throwLeft",state:false});
    }
    if(event.keyCode === 38){ // w
      //InputMove.keyPress({type:"throw",inputId:"throwUp",state:false});
    }
  }
}

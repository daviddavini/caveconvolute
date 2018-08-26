var canvas = document.getElementById("ctx");
var ctx = canvas.getContext("2d");
ctx.font = '5px Arial';

CSIZE = ctx.canvas.height;
INVWIDTH = ctx.canvas.width-CSIZE;

var FPS = 60;
DEBUG = false;
DEBUGBOX = false;
DEBUGSTATS = false;
WINDOWSIZE = 12; //20 while actual size is 30 works the best so far
DEBUGWINDOWSIZE = 200;
GAMEWINDOWSIZE = 25;

CUTWINDOWSIZE = 12; //20
CONNECTWINDOWSIZE = 30 //40
SAFEDIST = 3*WINDOWSIZE

if(DEBUG) {
  NOWWINDOWSIZE = DEBUGWINDOWSIZE; //area that can be seen in the window at once
  BACKCOLOR = "lightyellow";
  FSIZE = CSIZE/NOWWINDOWSIZE;
} else {
  NOWWINDOWSIZE = GAMEWINDOWSIZE;
  BACKCOLOR = "black";
  FSIZE = CSIZE/NOWWINDOWSIZE;
}
var X = 0;
var Y = 0;

DRAWDIST = 2*WINDOWSIZE; //area where it will load the intersection, and cutout intersection
      //diff between safedist and loaddist should serve as a barrier for cave thickness
SAFEDIST = 3*WINDOWSIZE; //area that will be clear and straight
      //a bit larger - the critical area that the walker will avoid
var CSS_COLOR_NAMES = ["red", "orange", "yellow", "green", "indigo", "blue", "violet", "pink"];
var drawWindow = function(x,y) {
  ctx.fillRect(x, y, FSIZE, FSIZE);
  ctx.beginPath();
  ctx.rect(x-FSIZE*WINDOWSIZE/2, y-FSIZE*WINDOWSIZE/2,FSIZE*WINDOWSIZE,FSIZE*WINDOWSIZE);
  ctx.stroke();
  ctx.closePath();
}

var wrapFunction = function(fn, context) {
  return function() {
    fn.apply(context, arguments);
  };
}

var bounded = function(min, max, numb){
  return Math.min(max, Math.max(min, numb));
}

var randInt = function(min, max){
  return Math.floor(Math.random()*(max-min))+min;
}
var randPop = function(array){
  var index = randInt(0, array.length);
  var element = array[index];
  for(var i = index; i < array.length-1; i++){
    array[i] = array[i+1];
  }
  array.pop(array.length-1);
  return element;
}
var test = function(array){
  array.push(1);
}
var randomProp = function(obj){
  var keys = Object.keys(obj);
  return obj[keys[Math.floor(keys.length * Math.random())]];
}

var randomIndexWeighted = function(weights, func){
  func = func ? func : function(x){return x};
  var sum = 0;
  for(var weight of weights){
    sum += func(weight);
  }
  choice = sum * Math.random();
  var i = 0;
  while(choice >= func(weights[i])){
    choice -= func(weights[i]);
    i++;
  }
  return i;
}

var randomColor = function(){
  return CSS_COLOR_NAMES[randInt(0,CSS_COLOR_NAMES.length)];
}

var isEmptyObject = function(obj){
  return Object.keys(obj).length === 0;
}

var copy2DArray = function(arr){
  var res = new Array(length);
  for(var i = 0; i < arr.length; i++){
    res.push(arr[i].slice(0));
  }
  return res;
}

var create2DArray = function(length, width, fill){
  var res = new Array(length);
  for(var i = 0; i < length; i++){
    res[i] = new Array(width);
  }
  for(var i = 0; i < length; i++){
    for(var j = 0; j < width; j++){
      res[i][j] = fill;
    }
  }
  return res;
}

var equal2DArrays = function(arr1, arr2){
  for(var i = 0; i < arr1.length; i++){
    for(var j = 0; j < arr2[0].length; j++){
      if(arr1[i][j] !== arr2[i][j]){
        return false;
      }
    }
  }
  return true;
}

var uniqueAngleRep = function(angle){
  var centered = false;
  while(!centered){
    if(angle >= Math.PI)
      angle -= 2*Math.PI;
    else if(angle < -Math.PI)
      angle += 2*Math.PI;
    else
      centered = true;
  }
  return angle;
}

//-1 to 1
var randBell = function(){
  return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
}

var randBellInt = function(avg, amp){
  return Math.floor(amp*randBell()+avg);
}

var drawPt = function(x,y){
  ctx.fillStyle = "green";
  ctx.fillRect(x*FSIZE, y*FSIZE, FSIZE, FSIZE);
}

var shuffleArray = function(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
    }
}

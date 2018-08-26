class Walker {
  constructor(steadyMode, normalMode, cave){
    this.cave = cave;
    this.pos = new Vector(0,0);
    this.path = [new Vector(0,0)];
    this.edges = {
      left: -500,
      right: 500,
      up: -500,
      down: 500
    };
    this.width = this.edges.right-this.edges.left;
    this.height = this.edges.down-this.edges.up;
    this.steadyMode = steadyMode;
    this.normalMode = normalMode;
    this.angle = Math.random()*2*Math.PI;
    this.angleChange = Math.random()*2*Math.PI;
    this.plugStarts = [];
    this.criticalAreas = [];
    this.fatAreas = [];
    this.edgeBuffer = 100;
    this.doubleTrackChance = 0.2; //0.15
    this.doubleTrackRange = [10, 90]; //10, 90
    this.centralPath = [new Vector(0,0)];
    this.maxTrekAttempts = 30;
  }
  updateAngleStuff(maxAngleAcc, maxAngleChange){
    this.angleChange += (2*Math.random()-1)*(maxAngleAcc);
    this.angleChange = Math.min(maxAngleChange, Math.max(-maxAngleChange,(this.angleChange)));
    this.angle += this.angleChange;
  }
  getAvoidVector(){
    var avoidVector = new Vector(0,0);
    var tooClose = false;
    var l = this.criticalAreas.length;
    for(var i = 0; i < l; i++){
        if(this.pos.inSquareAround(this.criticalAreas[i].pos, SAFEDIST+1)){
          var awayDirection = this.pos.minus(this.criticalAreas[i].pos);
          if(awayDirection.equals(new Vector(0,0)))
            awayDirection = Vector.randUnit();
          avoidVector.add(awayDirection.normalize());
          tooClose = true;
        }
    }
    if(tooClose)
      return avoidVector;
    return false;
  }
  avoidCriticalAreas(){
    var avoidVector = this.getAvoidVector();
    if(avoidVector){
      this.angle = avoidVector.angle();
      this.angleChange = 0;
      //step.add(avoidVector).normalize();
      return true;
    }
  }
  takeStep(addToPath){
    var step = Vector.unit(this.angle);
    // if (Math.random() < 0.0005)
    //   step.mult(8);
    this.pos.add(step);
  }
  walk(numOfSteps){
    for(var i = 0; i < numOfSteps; i++){
      if(Math.random() < this.doubleTrackChance){
        this.makeDouble();
      }
      this.updateAngleStuff(this.normalMode.maxAngleAcc,
                            this.normalMode.maxAngleChange);
      this.avoidCriticalAreas();
      this.takeStep();
      this.path.push(this.pos.copy());
      this.centralPath.push(this.pos.copy());
    }
  }
  runFrom(pinPos, isCentral){
    while(this.pos.inSquareAround(pinPos, SAFEDIST+1)){
      this.updateAngleStuff(this.steadyMode.maxAngleAcc,
                            this.steadyMode.maxAngleChange);
      this.takeStep();
      this.path.push(this.pos.copy());
      if(isCentral){
        this.centralPath.push(this.pos.copy());
      }
    }
  }
  isClearSpot(newPath){
    for(var i = 0; i < this.path.length; i++){
      if(this.path[i].inSquareAround(this.pos, SAFEDIST+1))
        return false;
    }
    if(newPath){
      for(var i = 0; i < newPath.length; i++){
        if(newPath[i].inSquareAround(this.pos, SAFEDIST+1))
          return false;
      }
    }
    return true;
  }
  trek(isCentral){
    var trekPath = [];
    while(!this.isClearSpot()){
      this.updateAngleStuff(this.steadyMode.maxAngleAcc,
                            this.steadyMode.maxAngleChange);
      this.avoidCriticalAreas();
      this.takeStep();
      trekPath.push(this.pos.copy());
    }
    this.path.push(...trekPath);
    if(isCentral){
      this.centralPath.push(...trekPath);
    }
  }
  makeDouble(){
    var startPos = this.pos.copy();
    //var fatAroundPoss = [];
    this.angle = Math.random()*2*Math.PI;
    this.angleChange = (2*Math.random()-1)*this.normalMode.maxAngleChange;
    for(var i = 0; i < randInt(this.doubleTrackRange[0], this.doubleTrackRange[1]); i++){       ///////////////////////////////////////////
      this.updateAngleStuff(this.normalMode.maxAngleAcc,
                            this.normalMode.maxAngleChange);
      this.avoidCriticalAreas();
      this.takeStep();
      this.path.push(this.pos.copy());
      //fatAroundPoss.push(this.pos.copy());
    }
    this.pos = startPos;
    this.angle = Math.random()*2*Math.PI;
    var pinPos = this.pos.copy();
    var pinAngle = this.angle;
    //this.fatAreas.push({pos:pinPos, angle:pinAngle, poss:fatAroundPoss});
    this.angleChange = (2*Math.random()-1)*this.normalMode.maxAngleChange;
  }
  makePlugStart(){
    var pinPos = this.pos.copy();
    var pinAngle = this.angle;
    this.plugStarts.push({pos:pinPos, angle:pinAngle});
  }
  steerAngleTowards(finishAngle, maxAngleAcc, maxAngleChange){
    var angleDif = uniqueAngleRep(finishAngle - this.angle);
    if(angleDif>0){
      this.angleChange = maxAngleChange;
    } else if(angleDif<0){
      this.angleChange = -maxAngleChange;
    } else{
      this.angleChange = 0;
    }
    this.angleChange += (2*Math.random()-1)*(maxAngleAcc);
    this.angle += this.angleChange;
  }
  makePlug(finishAngle){
    //console.log("i have plugs left ", this.plugStarts);
    var plugStart = randPop(this.plugStarts);
    this.pos = plugStart.pos.copy();
    this.angle = finishAngle;
    var newPath = [];
    var toAddToNewPath = [];
    var trekPath = [];
    do{
      toAddToNewPath = [];
      var trekAttempts = 0;
      while(!this.isClearSpot(newPath)){
        this.steerAngleTowards(finishAngle, this.normalMode.maxAngleAcc,
                        this.normalMode.maxAngleChange);
        if(this.avoidCriticalAreas()){
          trekAttempts++;
          if(trekAttempts > this.maxTrekAttempts){
            return false;
          }
          console.log("just did a weird thing ... fraid of it later")
          toAddToNewPath.push(...trekPath); // I can no longer trust this path to be straight, must go away from it
          trekPath = [];
        }
        this.takeStep();
        trekPath.push(this.pos.copy());
      }
      newPath.push(...toAddToNewPath);
    } while(toAddToNewPath.length > 0);
    newPath.push(...trekPath);
    this.path.push(...newPath);
    var pinPos = this.pos.copy();
    var pinAngle = this.angle;
    this.criticalAreas.push({pos:pinPos, job:"plug", angle:pinAngle});
    var res = create2DArray(this.width, this.height, false);
    for(var i = 0; i < newPath.length; i++){
      res[Math.floor(newPath[i].x)-this.edges.left][Math.floor(newPath[i].y)-this.edges.up] = true;
    }
    return {plug:new Connector(pinPos.floored().minus(new Vector(this.edges.left, this.edges.up)),
                        "plug", pinAngle, this.cave, "both"),
            floorAdditions:res};
  }
  makeOutlet(){
    this.trek(true);
    var pinPos = this.pos.copy();
    var pinAngle = this.angle;
    this.criticalAreas.push({pos:pinPos, job:"outlet", angle:pinAngle});
    var pinPos = this.pos.copy();
    var pinAngle = this.angle;
    this.fatAreas.push({pos:pinPos, angle:pinAngle, poss:[]});
    this.runFrom(pinPos, true);
  }
  makePath(numbOfSteps, numbOfPlugs, numbOfOutlets){
    var plugStartsToDo = numbOfPlugs;
    var outletsToDo = numbOfOutlets;
    var remainingSteps = numbOfSteps;
    for(var i = 0; i < numbOfPlugs+numbOfOutlets; i++){
      var someSteps = Math.floor(remainingSteps*Math.random());
      this.walk(someSteps);
      remainingSteps -= someSteps;
      var choice = Math.random();
      if(choice < plugStartsToDo/(plugStartsToDo+outletsToDo)) {
        this.makePlugStart();
        plugStartsToDo -= 1;
        this.makeDouble();
      } else{
        this.makeOutlet();
        outletsToDo -= 1;
      }
    }
    this.walk(remainingSteps);
  }
  draw(canv, shiftX, shiftY){
    var shiftLeft = 0;
    canv.fillStyle = "black";
    for(var i = 0; i < this.path.length; i++){
      canv.fillRect(CSIZE/2 + (this.path[i].x+shiftX+X)*FSIZE + shiftLeft,
        CSIZE/2 + (this.path[i].y + shiftY+Y)*FSIZE, FSIZE, FSIZE);
    }
    for(var i = 0; i < this.criticalAreas.length; i++){
      if(this.criticalAreas[i].job === "plug")
        canv.fillStyle = "blue";
      if(this.criticalAreas[i].job === "outlet")
        canv.fillStyle = "red";
      canv.fillRect(CSIZE/2 + (this.criticalAreas[i].pos.x+X+shiftX)*FSIZE + shiftLeft,
        CSIZE/2 + (this.criticalAreas[i].pos.y+Y+shiftY)*FSIZE, 1.5*FSIZE, 1.5*FSIZE);
      canv.beginPath();
      canv.rect(CSIZE/2 + (this.criticalAreas[i].pos.x+X+shiftX)*FSIZE-FSIZE*SAFEDIST/2 + shiftLeft,
        CSIZE/2 + (this.criticalAreas[i].pos.y+Y+shiftY)*FSIZE-FSIZE*SAFEDIST/2,FSIZE*SAFEDIST,FSIZE*SAFEDIST);
      canv.stroke();
      canv.closePath();
    }
    canv.fillStyle = "black";
  }
  findEdges(){
    var farthestLeft = 0;
    var farthestRight = 0;
    var farthestDown = 0;
    var farthestUp = 0;
    for(var i = 0; i < this.path.length; i++){
      if(this.path[i].x < farthestLeft)
        farthestLeft = this.path[i].x;
      if(this.path[i].x > farthestRight)
        farthestRight = this.path[i].x;
      if(this.path[i].y < farthestUp)
        farthestUp = this.path[i].y;
      if(this.path[i].y > farthestDown)
        farthestDown = this.path[i].y;
    }
    farthestLeft = Math.floor(farthestLeft-this.edgeBuffer);
    farthestRight = Math.floor(this.edgeBuffer+farthestRight);
    farthestUp = Math.floor(farthestUp-this.edgeBuffer);
    farthestDown = Math.floor(this.edgeBuffer+farthestDown);
    return {left:farthestLeft, right:farthestRight, up:farthestUp, down:farthestDown};
  }
  getArrayInfo(){
    var width = this.edges.right-this.edges.left;
    var height = this.edges.down-this.edges.up;
    var res = create2DArray(width, height, false);
    for(var i = 0; i < this.path.length; i++){
      res[Math.floor(this.path[i].x)-this.edges.left][Math.floor(this.path[i].y)-this.edges.up] = true;
    }
    var connectors = {};
    var freeOutlets = {};
    for(var i = 0; i < this.criticalAreas.length; i++){
      var connector = new Connector(this.criticalAreas[i].pos.floored().minus(new Vector(this.edges.left, this.edges.up)),
                          this.criticalAreas[i].job, this.criticalAreas[i].angle, this.cave, "both");
      connectors[connector.id] = connector;
      freeOutlets[connector.id] = connector;
    }
    var centralPath = [];
    for(var i = 0; i < this.centralPath.length; i++){
      centralPath.push(this.centralPath[i].minus(new Vector(this.edges.left, this.edges.up)));
    }
    var fatAreas = [];
    for(var i = 0; i < this.fatAreas.length; i++){
      var poss = [];
      for(var pos of this.fatAreas[i].poss){
        poss.push(pos.minus(new Vector(this.edges.left, this.edges.up)));
      }
      fatAreas.push({pos: this.fatAreas[i].pos.minus(new Vector(this.edges.left, this.edges.up)),
                    angle: this.fatAreas[i].angle,
                    poss:poss});
    }
    return {floor:res, connectors:connectors, freeOutlets:freeOutlets, width:width,
            height:height, centralPath:centralPath, fatAreas:fatAreas};
  }
}

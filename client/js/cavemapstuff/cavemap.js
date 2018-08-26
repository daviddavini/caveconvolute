class CaveMap {
  constructor(cave, groundImages, numbOfPlugs, numbOfOutlets){
    //{maxAngleAcc:Math.PI*0.15, maxAngleChange:Math.PI*0.03},{maxAngleAcc:Math.PI*0.15, maxAngleChange:Math.PI*0.1}
    this.cave = cave;
    this.groundImages = groundImages;
    this.color = "white";
    this.numbOfPlugs = numbOfPlugs;
    this.numbOfOutlets = numbOfOutlets;
    this.numbOfFreePlugs = numbOfPlugs;
    this.numbOfFreeOutlets = numbOfOutlets;
    this.floor = null;
    this.floorImageNumbers = null;
    this.freeOutlets = null;
    this.connectors = null;
    this.groundImageOutline = assetManager.getImage("groundoutline");
  }
  chooseFloorImages(){
    this.floorImageNumbers = create2DArray(this.width, this.height, 0);
    var groundImagesLength = this.groundImages.length;
    for(var i = 0; i < this.width; i++){
      for(var j = 0; j < this.width; j++){
        if(this.floor[i][j])
          this.floorImageNumbers[i][j] = randInt(0, groundImagesLength);
      }
    }
  }
  connectTo(outlet){
    console.log(this.cave.number + " plugging into " + outlet.parentCave.number);
    var walkerPlugInfo = this.walker.makePlug(outlet.angle+Math.PI/2);
    if(!walkerPlugInfo){
      this.numbOfFreePlugs -= 1;
      this.numbOfPlugs -= 1;
      console.log(this.cave.number, "lost a plug");
      return false;
    }
    this.connectors[walkerPlugInfo.plug.id] = walkerPlugInfo.plug;
    this.numbOfFreePlugs -= 1;
    var floorAdditions = walkerPlugInfo.floorAdditions;
    var growPlan = [];
    for(var i = 0; i < randInt(3,5); i++){
      growPlan.push([0.3, 0.14]);
    }
    floorAdditions = this.doGrowsOn(floorAdditions, growPlan);
    this.addFloor(floorAdditions);
    walkerPlugInfo.plug.connectTo(outlet);
    outlet.parentCave.caveMap.numbOfFreeOutlets -= 1;
    delete outlet.parentCave.caveMap.freeOutlets[outlet.id];
    return true;
  }
  addFloor(floorAdditions){
    var newFloor = copy2DArray(this.floor);
    for(var i = 1; i < this.width-1; i++){
      for(var j = 1; j < this.height-1; j++){
        if(floorAdditions[i][j] || this.floor[i][j])
          newFloor[i][j] = true;
      }
    }
    this.floor = newFloor;
    this.chooseFloorImages();
    this.createBarrierBoxes();
  }
  doGrowsOn(floor, growPlan){
    for(var i = 0; i < growPlan.length; i++){
      floor = this.grow(floor, growPlan[i][0], growPlan[i][1]);
    }
    return floor;
  }
  hasATrue(floor){
    for(var i = 0; i < floor.length; i++){
      for(var j = 0; j < floor[0].length; j++){
        if(floor[i][j])
          return [i,j];
      }
    }
    console.log("uh oh");
  }
  numbOfSquares(floor){
    var x = 0;
    for(var i = 0; i < floor.length; i++){
      for(var j = 0; j < floor[0].length; j++){
        if(floor[i][j])
          x++;
      }
    }
    return x;
  }
  numbOfNeighborsAround(floor, i, j){
    return (floor[i-1][j] + floor[i+1][j] + floor[i][j-1] + floor[i][j+1]
      + floor[i-1][j-1] + floor[i-1][j+1] + floor[i+1][j-1] + floor[i+1][j+1]);
  }
  numbOfCloseNeighborsAround(floor, i, j){
    return (this.floor[i-1][j] + this.floor[i+1][j] + this.floor[i][j-1] + this.floor[i][j+1]);
  }
  grow(floor, baseChance, neighborWeight){
    var newFloor = copy2DArray(floor);
    for(var i = 1; i < this.width-1; i++){
      for(var j = 1; j < this.height-1; j++){
        var numbOfNeighbors = this.numbOfNeighborsAround(floor, i, j);
        if(numbOfNeighbors > 0 && (Math.random() < baseChance + neighborWeight*numbOfNeighbors)){ //0.3, 0.2
          newFloor[i][j] = true;
        }
      }
    }
    return newFloor;
  }
  createBarrierBoxes(){
    //sorted by x pos
    this.barrierBoxes = [];
    this.barrierBoxStarts = [null];
    for(var i = 1; i < this.width-1; i++){
      this.barrierBoxStarts.push(this.barrierBoxes.length);
      for(var j = 1; j < this.height-1; j++){
        if(!this.floor[i][j] && this.numbOfNeighborsAround(this.floor,i,j) > 0){
          this.barrierBoxes.push(new Box(new Vector(i, j), new Vector(1,1)));
        }
      }
    }
    for(var id in this.connectors){
      for(var sensorBlock of this.connectors[id].sensorBlocks){
        for(var i = this.barrierBoxStarts[sensorBlock.x]; i < this.barrierBoxStarts[sensorBlock.x+1]; i++){
          if(this.barrierBoxes[i].pos.equals(sensorBlock)){
            this.barrierBoxes.splice(i,1);
            i--;
            for(var i = sensorBlock.x+1; i < this.barrierBoxStarts.length; i++){
              this.barrierBoxStarts[i]--;
            }
          }
        }
      }
    }
  }
  randomPos(){
    var pos = new Vector(randInt(0,this.width), randInt(0,this.height));
    while(!this.floor[pos.x][pos.y]){
      var pos = new Vector(randInt(0,this.width), randInt(0,this.height));
    }
    return pos;
  }
  randomPosGroup(numb, sideLength){
    var basePos = this.randomPos();
    var poss = [];
    var radius = Math.floor(sideLength/2);
    var density = numb / (radius*radius*4);
    for(var i = -radius; i <= radius; i++){
      for(var j = -radius; j <= radius; j++){
        if(Math.random()<density && this.floor[basePos.x+i][basePos.y+j]){
          poss.push(basePos.plus(new Vector(i,j)));
        }
      }
    }
    return poss;
  }
  update(dt){
    for(var entity of this.cave.entities.get("wallcollidables")){
      //console.log(entity);
      var leftmost = Math.floor(entity.pos.x);
      // will crash if player is less than 1 away from the map edge
      var rightmost = Math.floor(entity.pos.x+entity.size.x);
      for(var i = this.barrierBoxStarts[leftmost]; i < this.barrierBoxStarts[rightmost+1]; i++){
        // if(entity instanceof Player && !entity.vel.equals(new Vector(0,0))){
        //   console.log(entity);
        // }
        // if(entity.box.checkDidandFixOverlap(entity.vel.times(dt), this.barrierBoxes[i])){
        //   //console.log(entity);
        // }
        var overlapFixVec = entity.box.getOverlapFix(entity.posChange, this.barrierBoxes[i]);
        if(overlapFixVec){
          entity.hitObstacle(overlapFixVec);
        }
        // if(entity.box.isOverlapping(this.barrierBoxes[i])){
        //   //entity.box.pos.take(entity.vel.times(dt));
        //   entity.box.fixOverlap(this.barrierBoxes[i]);
        // }
      }
    }
    for(var id in this.connectors){
      this.connectors[id].update(dt);
    }
  }
  draw(canv, shiftX, shiftY, playerPos){
    this.drawFloor(canv, this.floor, shiftX, shiftY, playerPos);
    if(DEBUG){
      for(var box of this.barrierBoxes){
        canv.fillStyle = "black";
        canv.fillRect((box.pos.x+shiftX)*FSIZE, (box.pos.y+shiftY)*FSIZE, FSIZE, FSIZE);
      }
      for(var id in this.connectors){
        this.connectors[id].draw(canv, shiftX, shiftY);
      }
      if(this.type === "strand")
        this.walker.draw(canv, shiftX, shiftY);
    }
  }
  drawFloorOutline(canv, floor, shiftX, shiftY){
    var pixelBuffer = 1/4;
    for(var i = 0; i < this.width; i++){
      for(var j = 0; j < this.height; j++){
        if(floor[i][j]){
          canv.drawImage(this.groundImageOutline, (i+shiftX-pixelBuffer)*FSIZE,
                        (j+shiftY-pixelBuffer)*FSIZE, (1+2*pixelBuffer)*FSIZE, (1+2*pixelBuffer)*FSIZE);
        }
      }
    }
  }
  drawFloor(canv, floor, shiftX, shiftY, playerPos){
    //this.drawFloorOutline(canv, floor, shiftX, shiftY);
    var center = playerPos.floored();
    if(this.groundImages){
      var pixelBuffer = 1/8;
      var groundImagesLength = this.groundImages.length;
      for(var i = center.x-NOWWINDOWSIZE; i < center.x+NOWWINDOWSIZE; i++){
        for(var j = center.y-NOWWINDOWSIZE; j < center.y+NOWWINDOWSIZE; j++){
          if(i>=0 && j>=0 && i<this.width && j<this.height && floor[i][j]){
            canv.drawImage(this.groundImages[this.floorImageNumbers[i][j]], (i+shiftX-pixelBuffer)*FSIZE,
                          (j+shiftY-pixelBuffer)*FSIZE, (1+2*pixelBuffer)*FSIZE, (1+2*pixelBuffer)*FSIZE);
          }
        }
      }
    }else{
      canv.fillStyle = this.color;
      var tileBuffer = 2;
      for(var i = 0; i < this.width; i++){
        for(var j = 0; j < this.height; j++){
          if(floor[i][j]){
            canv.fillRect((i+shiftX)*FSIZE-tileBuffer, (j+shiftY)*FSIZE-tileBuffer,
                          FSIZE+2*tileBuffer, FSIZE+2*tileBuffer);
          }
        }
      }
    }
  }
}

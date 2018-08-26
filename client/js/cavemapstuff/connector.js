class Connector {
  constructor(pos, job, angle, parentCave, side){
    this.id = Math.random();
    this.pos = pos;
    this.job = job;
    this.side = side;
    this.angle = angle;
    this.color = randomColor();
    this.sensorBlockColor = randomColor();
    this.parentCave = parentCave;
    this.isConnected = false;
    this.connectedConnector = null;
    this.connectedCave = null;
    this.minAngleDif = Math.PI*0.45;
    this.sensorBlocks = [];
    this.CUTWINDOWSIZE = WINDOWSIZE;
  }
  update(dt){
    for(var player of this.parentCave.entities.get("players")){
      var playerGridPos = player.pos.floored();
      if(playerGridPos.inSquareAround(this.pos, CONNECTWINDOWSIZE)){
        if(!this.isConnected){
          if(this.parentCave.cluster.makeConnectionFor(this)){
            player.hookOnto(this);
          }
        } else{
          player.hookOnto(this);
        }
      }
      if(player.hookConnectors[this.id] && !playerGridPos.inSquareAround(this.pos, CONNECTWINDOWSIZE)){
        player.unhookFrom(this);
      }
    }
    for(var entity of this.parentCave.entities.get()){
      var entityGridPos = entity.pos.floored();
      for(var sensorBlock of this.sensorBlocks){
        if(entity.inCave === this.parentCave && entityGridPos.equals(sensorBlock)){
          entity.flipFlop(this);
          //console.log("flipped", entity);
        }
      }
    }
  }
  getShift(){
    if(this.isConnected) {
      return new Vector(this.pos.x-this.connectedConnector.pos.x, this.pos.y-this.connectedConnector.pos.y);
    } else {
      return false;
      console.log('whoops');
    }
  }
  connectTo(connector){
    //console.log(this, " connecting to " + connector);
    this.attachTo(connector);
    connector.attachTo(this);
    var cutRadius = Math.floor(this.CUTWINDOWSIZE/2);
    var caveMap = this.parentCave.caveMap;
    var connectorCaveMap = connector.parentCave.caveMap;
    if(this.job === "plug")
      this.cutOut(cutRadius, connector, caveMap, connectorCaveMap);
    else if(connector.job === "plug")
      connector.cutOut(cutRadius, this, connectorCaveMap, caveMap);
    this.makeSensorBlocks(cutRadius, connector, caveMap, connectorCaveMap);
    connector.makeSensorBlocks(cutRadius, this, connectorCaveMap, caveMap);
  }
  attachTo(connector){
    this.connectedCave = connector.parentCave;
    this.connectedConnector = connector;
    this.isConnected = true;
  }
  cutOut(cutRadius, connector, caveMap, connectorCaveMap){
    var floorChanges = copy2DArray(caveMap.floor);
    for(var i = -cutRadius; i <= cutRadius; i++){
      for(var j = -cutRadius; j <= cutRadius; j++){
        if(caveMap.floor[this.pos.x+i][this.pos.y+j] && connectorCaveMap.floor[connector.pos.x+i][connector.pos.y+j])
          floorChanges[this.pos.x+i][this.pos.y+j] = false;
      }
    }
    caveMap.floor = floorChanges;
  }
  makeSensorBlocks(cutRadius, connector, caveMap, connectorCaveMap){
    var floorChanges = copy2DArray(caveMap.floor);
    for(var i = -cutRadius; i <= cutRadius; i++){
      for(var j = -cutRadius; j <= cutRadius; j++){
        if(!caveMap.floor[this.pos.x+i][this.pos.y+j] && connectorCaveMap.floor[connector.pos.x+i][connector.pos.y+j] &&
          caveMap.numbOfNeighborsAround(caveMap.floor, this.pos.x+i, this.pos.y+j)>0){
          //floorChanges[this.pos.x+i][this.pos.y+j] = true;
          this.sensorBlocks.push(this.pos.plus(new Vector(i,j)));
        }
      }
    }
    caveMap.floor = floorChanges;
    caveMap.createBarrierBoxes();
  }
  compatibleWith(connector){
    if(this.isConnected){
      //console.log("i'm already connected");
      return false;
    }
    if(connector.isConnected){
      //console.log("it's already connected");
      return false;
    }
    if(this.job === connector.job){
      //console.log(this.id + "cannot plug " + this.job + " into " +connector.job + connector.id);
      return false;
    }
    if(!(this.angleCompatibleWith(connector))){
      return false;
    }
    return true;
  }
  angleCompatibleWith(connector){
    var angle = uniqueAngleRep(this.angle-connector.angle);
    if(this.side === "both" && connector.side === "both"){
      return (angle >= this.minAngleDif && angle <= Math.PI-this.minAngleDif) ||
              (angle <= -this.minAngleDif && angle >= -Math.PI+this.minAngleDif);
    }
    if((this.side === "left" && connector.side === "both") ||
        (this.side === "both" && connector.side === "right")){
      return (angle >= this.minAngleDif && angle <= Math.PI-this.minAngleDif);
    }
    if((this.side === "right" && connector.side === "both") ||
        (this.side === "both" && connector.side === "left")){
      return (angle <= -this.minAngleDif && angle >= -Math.PI+this.minAngleDif);
    }
    return false;
  }
  draw(canv, shiftX, shiftY){
    canv.fillStyle = this.color;
    canv.fillRect((this.pos.x+shiftX)*FSIZE, (this.pos.y+shiftY)*FSIZE, FSIZE, FSIZE);
    canv.beginPath();
    canv.rect((this.pos.x+ shiftX)*FSIZE-FSIZE*WINDOWSIZE/2,
      (this.pos.y+ shiftY)*FSIZE-FSIZE*WINDOWSIZE/2 ,FSIZE*WINDOWSIZE,FSIZE*WINDOWSIZE);
    canv.rect((this.pos.x+ shiftX)*FSIZE-FSIZE*SAFEDIST/2,
      (this.pos.y+ shiftY)*FSIZE-FSIZE*SAFEDIST/2,FSIZE*SAFEDIST,FSIZE*SAFEDIST);
    canv.rect((this.pos.x+ shiftX)*FSIZE-FSIZE*DRAWDIST/2,
      (this.pos.y+ shiftY)*FSIZE-FSIZE*DRAWDIST/2,FSIZE*DRAWDIST,FSIZE*DRAWDIST);
    canv.fillStyle = this.sensorBlockColor;
    for(var sensorBlock of this.sensorBlocks){
      canv.fillRect((sensorBlock.x+ shiftX)*FSIZE,
        (sensorBlock.y+ shiftY)*FSIZE,FSIZE,FSIZE);
    }
    canv.stroke();
    canv.closePath();
  }
}

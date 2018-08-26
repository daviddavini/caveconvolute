class RectMap extends CaveMap{
  constructor(cave, groundImages, plugStuff, outletStuff, width, height, numbGrows){
    super(cave, groundImages, plugStuff.length, outletStuff.length);
    this.makeFloor(width, height);
    this.connectors = {};
    this.freeOutlets = {};
    this.plugs = {};
    this.addConnectors(plugStuff, "plug");
    this.addConnectors(outletStuff, "outlet");
    this.growPlan = [];
    this.numbGrows = numbGrows === undefined ? 0 : numbGrows;
    for(var i = 0; i < this.numbGrows; i++){
      this.growPlan.push([0.3, 0.14]);
    }
    this.floor = this.doGrowsOn(this.floor, this.growPlan);
    super.chooseFloorImages();
    this.createBarrierBoxes();
  }
  getPercentTraveled(pos){
    return 1-pos.minus(this.roomTopLeft).y/this.roomHeight;
  }
  getPlayerSpot(){
    return this.upMiddle.plus(new Vector(0, this.roomHeight*0.8));
  }
  getBankerSpots(){
    return [this.leftMiddle.plus(new Vector(3,0)), this.leftMiddle.plus(new Vector(1, this.roomHeight*(1/3))),
            this.rightMiddle.plus(new Vector(-0.5-3,0)), this.rightMiddle.plus(new Vector(-0.5-1, this.roomHeight*(1/3)))];
  }
  getManSpot(){
    return this.upMiddle.plus(new Vector(0,2));
  }
  getGateSpot(){
    return this.upMiddle.plus(new Vector(0,1/2));
  }
  getCenter(){
    return new Vector(this.width/2, this.height/2);
  }
  addConnectors(connectorStuff, type){
    var angleChange = (Math.PI/2)*Math.random()-Math.PI/4;
    if(type === "plug")
      angleChange += Math.PI/2;
    if(connectorStuff.includes("down")){
      var connector = new Connector(this.downMiddle, type,
                                    Math.PI+angleChange, this.cave, "left");
      this.connectors[connector.id] = connector;
      if(type === "plug")
        this.plugs[connector.id] = connector;
      else
        this.freeOutlets[connector.id] = connector;
    }if(connectorStuff.includes("up")){
      var connector = new Connector(this.upMiddle, type,
                                    0+angleChange, this.cave, "left");
      this.connectors[connector.id] = connector;
      if(type === "plug")
        this.plugs[connector.id] = connector;
      else
        this.freeOutlets[connector.id] = connector;
    }if(connectorStuff.includes("left")){
      var connector = new Connector(this.leftMiddle, type,
                                    3*Math.PI/2+angleChange, this.cave, "left");
      this.connectors[connector.id] = connector;
      if(type === "plug")
        this.plugs[connector.id] = connector;
      else
        this.freeOutlets[connector.id] = connector;
    }if(connectorStuff.includes("right")){
      var connector = new Connector(this.rightMiddle, type,
                                    Math.PI/2+angleChange, this.cave, "left");
      this.connectors[connector.id] = connector;
      if(type === "plug")
        this.plugs[connector.id] = connector;
      else
        this.freeOutlets[connector.id] = connector;
    }
  }
  makeFloor(width, height){
    this.width = 200;
    this.height = 200;
    this.roomWidth = width;
    this.roomHeight = height;
    this.center = new Vector(this.width/2, this.height/2);
    this.center.floor();
    this.halfRoomSize = new Vector(width/2, height/2).floor();
    this.roomTopLeft = this.center.minus(this.halfRoomSize);
    this.roomBottomRight = this.center.plus(this.halfRoomSize);
    this.downMiddle = this.center.plus(new Vector(0, this.halfRoomSize.y));
    this.upMiddle = this.center.plus(new Vector(0, -this.halfRoomSize.y));
    this.rightMiddle = this.center.plus(new Vector(this.halfRoomSize.x, 0));
    this.leftMiddle = this.center.plus(new Vector(-this.halfRoomSize.x, 0));
    this.floor = create2DArray(this.width, this.height, false);
    for(var i = this.roomTopLeft.x; i <= this.roomBottomRight.x; i++){
      for(var j = this.roomTopLeft.y; j <= this.roomBottomRight.y; j++){
        this.floor[i][j] = true;
      }
    }
  }
  connectTo(outlet){
    console.log(this.cave.number + " plugging into " + outlet.parentCave.number);
    var plug = randomProp(this.plugs);
    this.numbOfFreePlugs -= 1;
    plug.connectTo(outlet);
    outlet.parentCave.caveMap.numbOfFreeOutlets -= 1;
    delete outlet.parentCave.caveMap.freeOutlets[outlet.id];
    return true;
  }
}

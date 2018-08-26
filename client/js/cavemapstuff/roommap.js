class RoomMap extends CaveMap{
  constructor(cave, groundImages, numbOfOutlets, radius, angleZero, numbGrows){
    super(cave, groundImages, 0, numbOfOutlets);
    this.angleZero = angleZero;
    this.radius = radius;
    this.makeFloor();
    this.makeConnectors();
    this.growPlan = [];
    this.numbGrows = numbGrows === undefined ? 3 : numbGrows;
    for(var i = 0; i < this.numbGrows; i++){
      this.growPlan.push([0.3, 0.14]);
    }
    this.floor = this.doGrowsOn(this.floor, this.growPlan);
    super.chooseFloorImages();
    this.createBarrierBoxes();
  }
  addOutlet(angle){
    var connector = new Connector(new Vector(this.center.x+Math.floor(this.radius*Math.cos(angle)),
                                  this.center.y+Math.floor(this.radius*Math.sin(angle))), "outlet",
                                  0, this.cave, "left");
    this.connectors[connector.id] = connector;
    this.freeOutlets[connector.id] = connector;
  }
  circlePoss(amt){
    if(amt === 1){
      return this.getCenter();
    }
    var poss = [];
    var stepAngle = Math.PI*2/amt;
    if(amt % 2 === 0){
      var angle = stepAngle;
    }else{
      var angle = stepAngle/4;
    }
    for(var i = 0; i < amt; i++){
      poss.push(new Vector(this.center.x+Math.floor(this.radius*Math.cos(angle)/2),
        this.center.y+Math.floor(this.radius*Math.sin(angle)/2)).plus(Vector.random(1)));
      angle += stepAngle;
    }
    return poss;
  }
  getCenter(){
    return new Vector(this.width/2, this.height/2);
  }
  makeFloor(){
    this.width = 200;
    this.height = 200;
    this.center = new Vector(this.width/2, this.height/2);
    this.center.floor();
    var halfh = Math.floor(this.height/2);
    this.floor = create2DArray(this.width, this.height, false);
    for(var i = 0; i < this.width; i++){
      for(var j = 0; j < this.height; j++){
        if(Math.pow(i-this.center.x, 2) + Math.pow(j-this.center.y, 2) < this.radius*this.radius){
          this.floor[i][j] = true;
        }
      }
    }
  }
  makeConnectors(){
    this.connectors = {};
    this.freeOutlets = {};
    var angleZero = this.angleZero || Math.PI*2*Math.random();
    for(var i = 0; i < this.numbOfOutlets; i++){
      var angle = (2*i*Math.PI/this.numbOfOutlets)+angleZero;
      var connector = new Connector(new Vector(this.center.x+Math.floor(this.radius*Math.cos(angle)),
                                    this.center.y+Math.floor(this.radius*Math.sin(angle))), "outlet",
                                    angle+Math.PI/2, this.cave, "left");
      this.connectors[connector.id] = connector;
      this.freeOutlets[connector.id] = connector;
    }
  }
}

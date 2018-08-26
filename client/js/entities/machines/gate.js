class Gate extends Entity{
  constructor(inCave, pos, defInfo){
    super(inCave, pos);
    this.weight = 1;

    var width = 5.5;
    this.size.set(new Vector(width, width*24/32));
    this.drawPosChange.set(new Vector(0,-width*(1-24/32)));
    this.drawSize.set(new Vector(width, width*32/32));

    this.pos.take(new Vector(this.size.x/2, this.size.y)).add(new Vector(1/2,-1/2));

    this.images = {
      closed: new Sprite(assetManager.getImage(["gate"]), this.drawPosChange, this.drawSize, 7, 0),
      open: new Sprite(assetManager.getImage(["gate"]), this.drawPosChange, this.drawSize, 7, 2, true)
    }
    this.image = this.images.closed;
    new State("open", this);
  }
  open(){
    this.states.open.start();
  }
  addToCave(inCave){
    super.addToCave(inCave);
    this.inCave.entities.addToCategory(this, "gates");
    this.inCave.entities.removeFromCategory(this, "wallcollidables");
    this.inCave.entities.addToCategory(this, "collidables");
    this.inCave.entities.addToCategory(this, "grounds");
  }
}
Gate.prototype.collisionHandles = {
  grounds: function(overlapFixVec, entity2, newCollision){
    if(!this.states.open.on){
      if(this.moveStyle instanceof IdleMove){
        entity2.hitObstacle(overlapFixVec);
      }
    }
  },
};
Gate.prototype.stateHandleStarts = {
  open: function(){
    this.image = this.images.open;
  }
};
Gate.prototype.stateHandleFinishes = {
  open: function(dt){
    this.image = this.images.closed;
  }
};

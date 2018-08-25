class Gate extends Entity{
  constructor(inCave, pos){
    super(inCave, pos);
    this.weight = 1;

    this.size.set(new Vector(9, 5));
    this.drawPosChange.set(new Vector(0,0));
    this.drawSize.set(this.size);

    this.pos.take(new Vector(this.size.x/2, this.size.y)).add(new Vector(1/2,0));

    this.images = {
      closed: new Sprite(assetManager.getImage(["gate"]), this.drawPosChange, this.drawSize),
      open: new Sprite(assetManager.getImage(["fuel"]), this.drawPosChange, this.drawSize)
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

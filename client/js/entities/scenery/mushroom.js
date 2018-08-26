class Mushroom extends Entity{
  constructor(inCave, pos){
    super(inCave, pos);
    this.spd = 15;
    this.scale = 0.75;
    this.size.set(new Vector(this.scale,0.2*this.scale*25/17));
    this.drawPosChange.set(new Vector(0,-0.8*this.scale*25/17));
    this.drawSize.set(new Vector(this.scale,this.scale*25/17));
    this.image = new Sprite(assetManager.getImage("mushrooms"), this.drawPosChange, this.drawSize);
    this.defaultMoveStyle = new IdleMove(this);
    this.setMoveStyle(this.defaultMoveStyle);
  }
  addToCave(inCave){
    super.addToCave(inCave);
    this.inCave.entities.addToCategory(this, "mushrooms");
    this.inCave.entities.addToCategory(this, "collidables");
    this.inCave.entities.addToCategory(this, "grounds");
  }
}
Mushroom.prototype.collisionHandles = {
  grounds: function(overlapFixVec, entity, newCollision){
    if(this.moveStyle instanceof IdleMove){
      entity.hitObstacle(overlapFixVec);
    }
  }
};
Mushroom.prototype.stateHandleStarts = {};
Mushroom.prototype.stateHandleFinishes = {};

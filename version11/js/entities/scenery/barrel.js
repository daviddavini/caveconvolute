class Barrel extends Entity{
  constructor(inCave, pos){
    super(inCave, pos);
    this.spd = 15;
    this.scale = 1.2;
    this.size.set(new Vector(this.scale*0.8,0.4*this.scale*18/14));
    this.drawPosChange.set(new Vector(-this.scale*0.1,-0.6*this.scale*18/14));
    this.drawSize.set(new Vector(this.scale,this.scale*18/14));
    this.image = new Sprite(assetManager.getImage("barrel"), this.drawPosChange, this.drawSize);
    this.defaultMoveStyle = new IdleMove(this);
    this.setMoveStyle(this.defaultMoveStyle);
  }
  addToCave(inCave){
    super.addToCave(inCave);
    this.inCave.entities.addToCategory(this, "barrels");
    this.inCave.entities.addToCategory(this, "collidables");
    this.inCave.entities.addToCategory(this, "grounds");
  }
}
Barrel.prototype.collisionHandles = {
  grounds: function(overlapFixVec, entity, newCollision){
    if(this.moveStyle instanceof IdleMove){
      entity.hitObstacle(overlapFixVec);
    }
  }
};
Barrel.prototype.stateHandleStarts = {};
Barrel.prototype.stateHandleFinishes = {};

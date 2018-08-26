class Pond extends Entity {
  constructor(inCave, pos, defInfo){
    super(inCave, pos);
    this.sideLength = 3;
    this.image = "lightblue";
    this.size.set(new Vector(this.sideLength, this.sideLength));
    this.drawPosChange.set(new Vector(-this.sideLength/2, -this.sideLength/2));
    this.drawSize.set(this.size);
  }
  addToCave(inCave){
    super.addToCave(inCave);
    this.inCave.entities.addToCategory(this, "ponds");
    this.inCave.entities.addToCategory(this, "collidables");
  }
}
Pond.prototype.collisionHandles = {
  all: function(overlapFixVec, entity2, newCollision){
    entity2.gainHp(1);
  }
};
Pond.prototype.stateHandleStarts = {};
Pond.prototype.stateHandleFinishes = {};

class Pond extends Entity {
  constructor(inCave, pos, defInfo){
    super(inCave, pos);
    this.sideLength = 4;
    this.image = "lightblue";
    this.size.set(new Vector(this.sideLength*0.7, this.sideLength*0.7));
    this.drawSize.set(new Vector(this.sideLength, this.sideLength));
    this.drawPosChange.set(this.size.minus(this.drawSize).times(0.5));
    this.image = new Sprite(assetManager.getImage(["oasis"]), this.drawPosChange, this.drawSize, 11, 6);
  }
  addToCave(inCave){
    super.addToCave(inCave);
    this.inCave.entities.addToCategory(this, "ponds");
    this.inCave.entities.addToCategory(this, "collidables");
  }
}
Pond.prototype.collisionHandles = {
  all: function(overlapFixVec, entity, newCollision){
    entity.gainHp(1);
  },
  flowers: function(overlapFixVec, entity, newCollision){
    entity.looseHp(20);
  }
};
Pond.prototype.stateHandleStarts = {};
Pond.prototype.stateHandleFinishes = {};

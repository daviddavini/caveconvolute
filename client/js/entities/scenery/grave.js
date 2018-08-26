class Grave extends Entity{
  constructor(inCave, pos){
    super(inCave, pos);
    this.spd = 15;
    this.scale = 0.75;
    this.size.set(new Vector(this.scale,0.2*this.scale*25/17));
    this.drawPosChange.set(new Vector(0,-0.8*this.scale*25/17));
    this.drawSize.set(new Vector(this.scale,this.scale*25/17));
    this.image = [new Sprite(assetManager.getImage("graveleft"), this.drawPosChange, this.drawSize),
                  new Sprite(assetManager.getImage("graveright"), this.drawPosChange, this.drawSize)][randInt(0,2)];
    this.defaultMoveStyle = new IdleMove(this);
    this.setMoveStyle(this.defaultMoveStyle);
  }
  addToCave(inCave){
    super.addToCave(inCave);
    this.inCave.entities.addToCategory(this, "graves");
    this.inCave.entities.addToCategory(this, "collidables");
    this.inCave.entities.addToCategory(this, "grounds");
  }
}
Grave.prototype.collisionHandles = {
  grounds: function(overlapFixVec, entity, newCollision){
    if(this.moveStyle instanceof IdleMove){
      entity.hitObstacle(overlapFixVec);
    }
  }
};
Grave.prototype.stateHandleStarts = {};
Grave.prototype.stateHandleFinishes = {};

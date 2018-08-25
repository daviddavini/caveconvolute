class BoneStick extends Entity{
  constructor(inCave, pos){
    super(inCave, pos);
    this.spd = 15;
    this.scale = 1.7;
    var sizeBuffer = 0.1;
    this.size.set(new Vector(this.scale*(1-2*sizeBuffer),0.25*this.scale*32/18));
    this.drawPosChange.set(new Vector(-this.scale*sizeBuffer,-0.75*this.scale*32/18));
    this.drawSize.set(new Vector(this.scale,this.scale*32/18));
    this.pos.add(this.drawSize);
    this.image = new Sprite(assetManager.getImage("bonestick"), this.drawPosChange, this.drawSize);

    this.defaultMoveStyle = new IdleMove(this);
    this.setMoveStyle(this.defaultMoveStyle);
  }
  addToCave(inCave){
    super.addToCave(inCave);
    this.inCave.entities.addToCategory(this, "bonesticks");
    this.inCave.entities.addToCategory(this, "collidables");
    this.inCave.entities.addToCategory(this, "grounds");
  }
}
BoneStick.prototype.collisionHandles = {
  grounds: function(overlapFixVec, entity, newCollision){
    if(this.moveStyle instanceof IdleMove){
      entity.hitObstacle(overlapFixVec);
    }
  }
};
BoneStick.prototype.stateHandleStarts = {};
BoneStick.prototype.stateHandleFinishes = {};

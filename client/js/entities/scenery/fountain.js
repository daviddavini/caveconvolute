class Fountain extends Entity{
  constructor(inCave, pos){
    super(inCave, pos);
    this.spd = 15;
    this.scale = 3.7;
    var sizeBuffer = 0.1;
    this.size.set(new Vector(this.scale*(1-2*sizeBuffer),0.4*this.scale*27/23));
    this.drawPosChange.set(new Vector(-this.scale*sizeBuffer,-0.6*this.scale*27/23));
    this.drawSize.set(new Vector(this.scale,this.scale*27/23));
    //this.pos.add(this.drawSize);
    this.image = new Sprite(assetManager.getImage("fountain"), this.drawPosChange, this.drawSize, 4, 6);

    this.defaultMoveStyle = new IdleMove(this);
    this.setMoveStyle(this.defaultMoveStyle);
  }
  addToCave(inCave){
    super.addToCave(inCave);
    this.inCave.entities.addToCategory(this, "fountains");
    this.inCave.entities.addToCategory(this, "collidables");
    this.inCave.entities.addToCategory(this, "grounds");
  }
}
Fountain.prototype.collisionHandles = {
  grounds: function(overlapFixVec, entity, newCollision){
    if(this.moveStyle instanceof IdleMove){
      entity.hitObstacle(overlapFixVec);
    }
  }
};
Fountain.prototype.stateHandleStarts = {};
Fountain.prototype.stateHandleFinishes = {};

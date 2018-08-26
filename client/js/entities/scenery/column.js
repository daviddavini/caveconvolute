class Column extends Entity{
  constructor(inCave, pos){
    super(inCave, pos);
    this.spd = 15;
    this.scale = 1.3;
    this.size.set(new Vector(this.scale,0.25*this.scale*32/13));
    this.drawPosChange.set(new Vector(0,-0.75*this.scale*32/13));
    this.drawSize.set(new Vector(this.scale,this.scale*32/13));
    this.pos.add(this.drawPosChange);
    this.image = new Sprite(assetManager.getImage("column"), this.drawPosChange, this.drawSize);
    this.defaultMoveStyle = new IdleMove(this);
    this.setMoveStyle(this.defaultMoveStyle);
  }
  addToCave(inCave){
    super.addToCave(inCave);
    this.inCave.entities.addToCategory(this, "columns");
    this.inCave.entities.addToCategory(this, "collidables");
    this.inCave.entities.addToCategory(this, "grounds");
  }
}
Column.prototype.collisionHandles = {
  grounds: function(overlapFixVec, entity, newCollision){
    if(this.moveStyle instanceof IdleMove){
      entity.hitObstacle(overlapFixVec);
    }
  }
};
Column.prototype.stateHandleStarts = {};
Column.prototype.stateHandleFinishes = {};

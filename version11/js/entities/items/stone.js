class Stone extends Entity{
  constructor(inCave, pos, type){
    super(inCave, pos);
    this.weight = 1;
    this.flyDamage = 1/2;
    this.type = type;
    this.level = 1;
    this.value = (3);

    if(this.type === "speed"){
      this.prop = "spd";
      this.boost = 1.27;
      this.image = new Sprite(assetManager.getImage(["speedstone"]), this.drawPosChange, this.drawSize);
      this.size.set(new Vector(0.7, 0.7));
      this.drawSize.set(new Vector(1, 1));
    } else if(this.type === "strength"){
      this.prop = "throwSpd";
      this.boost = 1.27;
      this.image = new Sprite(assetManager.getImage(["strengthstone"]), this.drawPosChange, this.drawSize);
      this.size.set(new Vector(0.8, 0.8));
      this.drawSize.set(new Vector(0.7, 0.7));
    }
    this.drawPosChange.set(this.size.minus(this.drawSize).times(1/2));
    this.makeShadow();
  }
  sameAs(entity){
    if(super.sameAs(entity)){
      return this.type === entity.type;
    }
    return false;
  }
  addToCave(inCave){
    super.addToCave(inCave);
    this.inCave.entities.addToCategory(this, "stones");
    this.inCave.entities.addToCategory(this, "items");
    this.inCave.entities.addToCategory(this, "collidables");
    this.inCave.entities.addToCategory(this, "grounds");
  }
  addedToInventory(entity){
    entity[this.prop] *= this.boost;
  }
  removedFromInventory(entity){
    entity[this.prop] /= this.boost;
  }
}
Stone.prototype.collisionHandles = {
  damagables: function(overlapFixVec, entity, newCollision){
    if(newCollision){
      if(this.moveStyle instanceof FlyMove){
        if(entity !== this.thrower){
          entity.looseHp(this.flyDamage, this);
        }
      }
    }
  }
};
Stone.prototype.stateHandleStarts = {};
Stone.prototype.stateHandleFinishes = {};
Stone.value = 3;

class Fuel extends Entity{
  constructor(inCave, pos, defInfo){
    super(inCave, pos);
    this.weight = 1;
    this.flyDamage = 1/2;
    this.level = 1;
    this.value = (1/2);
    //this.throwUpAngleTan = 1.4;
    this.breakChance = 1/4;
    this.pos.add(new Vector(0.2, 0.2));
    this.size.set(new Vector(0.6, 0.6));
    this.drawPosChange.set(new Vector(-0.2, -0.2));
    this.drawSize.set(new Vector(1,1));
    this.image = new Sprite(assetManager.getImage(["fuel"]), this.drawPosChange, this.drawSize);
    this.makeShadow();
  }
  getInfo(){
    return {
      
    };
  }
  addToCave(inCave){
    super.addToCave(inCave);
    this.inCave.entities.addToCategory(this, "fuels");
    this.inCave.entities.addToCategory(this, "items");
    this.inCave.entities.addToCategory(this, "collidables");
    this.inCave.entities.addToCategory(this, "grounds");
  }
  looseHp(amt){
    if(Math.random()<this.breakChance){
      super.looseHp(amt);
    }
  }
}
Fuel.prototype.collisionHandles = {
  damagables: function(overlapFixVec, entity, newCollision){
    if(newCollision){
      if(this.moveStyle instanceof FlyMove){
        if(entity !== this.thrower){
          this.looseHp(1);
          entity.looseHp(this.flyDamage), this;
        }
      }
    }
  }
};
Fuel.prototype.stateHandleStarts = {};
Fuel.prototype.stateHandleFinishes = {};
Fuel.value = 1/2;

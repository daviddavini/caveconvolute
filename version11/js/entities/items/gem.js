class Gem extends Entity{
  constructor(inCave, pos, defInfo){
    super(inCave, pos);
    this.weight = 0.75;
    this.flyDamage = 1;
    this.level = 3;
    this.value = 3;

    this.pos.add(new Vector(0.2, 0.2));
    this.size.set(new Vector(0.6, 0.6));
    this.drawPosChange.set(new Vector(-0.2, -0.2));
    this.drawSize.set(new Vector(1,1));
    this.image = new Sprite(assetManager.getImage(["greengem"]), this.drawPosChange, this.drawSize, 8, 7);
    this.makeShadow();
  }
  getInfo(){
    return {

    };
  }
  addToCave(inCave){
    super.addToCave(inCave);
    this.inCave.entities.addToCategory(this, "gems");
    this.inCave.entities.addToCategory(this, "items");
    this.inCave.entities.addToCategory(this, "collidables");
    this.inCave.entities.addToCategory(this, "grounds");
  }
}
Gem.prototype.collisionHandles = {
  grounds: function(overlapFixVec, entity2, newCollision){
    if(this.moveStyle instanceof IdleMove){
      entity2.hitObstacle(overlapFixVec);
    }
  },
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
Gem.prototype.stateHandleStarts = {};
Gem.prototype.stateHandleFinishes = {};
Gem.value = 3;
Gem.level = 3;

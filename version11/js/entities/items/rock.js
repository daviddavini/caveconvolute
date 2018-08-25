class Rock extends Entity{
  constructor(inCave, pos){
    super(inCave, pos);
    this.color = "yellow";
    this.weight = 1;
    this.flyDamage = 1;
    this.level = 1;
    this.value = (1);
    //this.throwUpAngleTan = 0.7;
    this.pos.add(new Vector(0.2, 0.2));
    this.size.set(new Vector(0.6, 0.6));
    this.drawSize.set(new Vector(0.9,0.9));
    this.drawPosChange.set(this.size.minus(this.drawSize).times(1/2));
    this.images = [new Sprite(assetManager.getImage(["rockbroken2"]), this.drawPosChange, this.drawSize),
                  new Sprite(assetManager.getImage(["rockbroken1"]), this.drawPosChange, this.drawSize),
                  new Sprite(assetManager.getImage(["rock"]), this.drawPosChange, this.drawSize)];
    this.maxHp = 3;
    this.hp = this.maxHp;
    this.image = this.images[Math.floor(this.hp/this.maxHp*this.images.length)-1];
    this.breakChance = 0.7;
    this.makeShadow();
  }
  addToCave(inCave){
    super.addToCave(inCave);
    this.inCave.entities.addToCategory(this, "rocks");
    this.inCave.entities.addToCategory(this, "items");
    this.inCave.entities.addToCategory(this, "collidables");
    this.inCave.entities.addToCategory(this, "grounds");
  }
  looseHp(amt){
    if(Math.random()<this.breakChance){
      super.looseHp(amt);
      if(!this.isDead)
        this.image = this.images[Math.floor(this.hp/this.maxHp*this.images.length)-1];
    }
  }
  setMoveStyle(moveStyle){
    if(this.moveStyle instanceof FlyMove){
      this.looseHp(1);
    }
    super.setMoveStyle(moveStyle);
  }
}
Rock.prototype.collisionHandles = {
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
Rock.prototype.stateHandleStarts = {};
Rock.prototype.stateHandleFinishes = {};
Rock.value = 1;

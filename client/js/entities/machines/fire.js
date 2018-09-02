class Fire extends Entity {
  constructor(inCave, pos, defInfo){
    super(inCave, pos);
    Fire.fires[this.id] = this;
    this.maxHp = 999999;
    this.hp = this.maxHp;
    this.maxHealth = 3*60;
    Fire.totalMaxHealth += this.maxHealth;
    this.health = this.maxHealth;
    Fire.totalHealth += this.health;
    this.healthIncrement = 30;
    this.maxSideLength = 4;
    this.minSideLength = 1;
    this.updateSideLength();
    this.images = [
      new Sprite(assetManager.getImage("firesmall"), this.drawPosChange, this.drawSize, 3, 6),
      new Sprite(assetManager.getImage("firemedium"), this.drawPosChange, this.drawSize, 3, 6),
      new Sprite(assetManager.getImage("firebig"), this.drawPosChange, this.drawSize, 3, 6)
    ];
    this.pos.take(this.size.times(0.5));
    this.updateImage();
  }
  updateSideLength(){
    this.sideLength = this.minSideLength+(this.maxSideLength-this.minSideLength)*(this.health/this.maxHealth);
    this.size.set(new Vector(this.sideLength*0.8, this.sideLength*0.8));
    this.drawSize.set(new Vector(this.sideLength, this.sideLength));
    this.drawPosChange.set(new Vector(-(this.drawSize.x-this.size.x)/2, -(this.drawSize.y-this.size.y)));
  }
  updateImage(){
    if(this.health === this.maxHealth)
      this.image = this.images[this.images.length];
    else
      this.image = this.images[Math.floor(this.health/this.maxHealth*this.images.length)];
  }
  addToCave(inCave){
    super.addToCave(inCave);
    this.inCave.entities.addToCategory(this, "fires");
    this.inCave.entities.addToCategory(this, "collidables");
  }
  die(){
  }
  addFuel(){
    this.health += this.healthIncrement;
    Fire.totalHealth += this.healthIncrement;
    if(this.health > this.maxHealth){
      Fire.totalHealth -= this.health - this.maxHealth;
      this.health = this.maxHealth;
    }
  }
  tick(dt){
    if(!DEBUG)
      this.health -= dt;
      Fire.totalHealth -= dt;
      if(this.health <= 0){
        Fire.totalHealth -= this.health;
        this.health  = 0;
      }
    if(this.health <= 0){
      this.die();
    }
    this.updateSideLength();
    this.updateImage();
  }
}

Fire.reset = function(){
  Fire.fires = {};
  Fire.totalHealth = 0;
  Fire.totalMaxHealth = 0;
}
Fire.reset();
Fire.atSmokeAlpha = 0.3;
Fire.color = "black";
Fire.smokingHealth = 60;
Fire.drawLight = function(canv){
  canv.fillStyle = Fire.color;
  if(Fire.totalHealth >= Fire.smokingHealth){
    canv.globalAlpha = Fire.atSmokeAlpha*(1-(Fire.totalHealth-Fire.smokingHealth)/(Fire.totalMaxHealth-Fire.smokingHealth));
    canv.fillRect(0, 0, canv.canvas.width, canv.canvas.height);
    canv.globalAlpha = 1;
  }
  if(Fire.totalHealth < Fire.smokingHealth){
    canv.globalAlpha = Fire.atSmokeAlpha+(1-Fire.atSmokeAlpha)*(1-Fire.totalHealth/Fire.smokingHealth);
    canv.fillRect(0, 0, canv.canvas.width, canv.canvas.height);
    canv.globalAlpha = 1;
  }
}
Fire.getLightPercent = function(){
  return (Fire.totalHealth/Fire.totalMaxHealth);
}
Fire.prototype.collisionHandles = {
  all: function(overlapFixVec, entity2, newCollision){
    entity2.looseHp(1);
  },
  fuels: function(overlapFixVec, entity2, newCollision){
    console.log("hey");
    this.addFuel();
    entity2.states.dead.start();
  }
};
Fire.prototype.stateHandleStarts = {};
Fire.prototype.stateHandleFinishes = {};

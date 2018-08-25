class Monster extends Entity{
  constructor(inCave, pos){
    super(inCave, pos);
    this.defaultMoveStyle = new BuzzMove(this, 0);
    this.setMoveStyle(this.defaultMoveStyle);
    this.spd = 3;
    this.sideLength =1.5+1*Math.random();
    this.size.set(new Vector(0.7*this.sideLength, this.sideLength));
    this.drawSize.set(new Vector(this.sideLength, this.sideLength));
    this.maxHp = 1;
    this.hp = this.maxHp;
    this.healthyimages = {left:new Sprite(assetManager.getImage("ghostleft"), new Vector(-0.15*this.sideLength,0), this.drawSize.copy()),
                  right:new Sprite(assetManager.getImage("ghostright"), new Vector(-0.15*this.sideLength,0), this.drawSize.copy())};
    this.hurtimages = {left:new Sprite(assetManager.getImage("ghosthurtleft"), new Vector(-0.15*this.sideLength,0), this.drawSize.copy()),
                  right:new Sprite(assetManager.getImage("ghosthurtright"), new Vector(-0.15*this.sideLength,0), this.drawSize.copy())};
    this.images = this.healthyimages;
    this.image = this.vel.x < 0 ? this.images.left : this.images.right;
    this.transparency = 0.5;
    new State("checkEntity", this, 2, 2, true).start();
    new State("chomping", this, 1);
  }
  drawImage(canv, image, shiftX, shiftY){
    canv.globalAlpha *= this.transparency;
    super.drawImage(canv, image, shiftX, shiftY);
    canv.globalAlpha /= this.transparency;
  }
  drawHurtShade(){
  }
  addToCave(inCave){
    super.addToCave(inCave);
    this.inCave.entities.addToCategory(this, "monsters");
    this.inCave.entities.addToCategory(this, "damagables");
    this.inCave.entities.addToCategory(this, "collidables");
    this.inCave.entities.addToCategory(this, "grounds");
  }
  update(dt){
    super.update(dt);
    if(this.states.beingHurt.on)
      console.log(this.images);
    this.image = this.vel.x < 0 ? this.images.left : this.images.right;
    if(this.states.beingHurt.on)
      console.log(this.image);
  }
}

Monster.prototype.collisionHandles = {
  players: function(overlapFixVec, entity2, newCollision){
    if(!this.states.chomping.on){
      entity2.looseHp(1.2);
      this.states.chomping.start();
    }
  },
  monsters: function(overlapFixVec, entity2, newCollision){
    entity2.hitObstacle(overlapFixVec);
  }
};
Monster.prototype.stateHandleStarts = {
  beingHurt: function(){
    this.images = this.hurtimages;
    this.moveStyle = new IdleMove(this);
  }
};
Monster.prototype.stateHandleFinishes = {
  checkEntity: function(dt){
    if(this.moveStyle instanceof BuzzMove){
      this.setMoveStyle(new ChaseMove(this, "players", 30, 1, 0.5, 0));
    }
  },
  beingHurt: function(dt){
    this.images = this.healthyimages;
    this.moveStyle = this.defaultMoveStyle;
  }
};

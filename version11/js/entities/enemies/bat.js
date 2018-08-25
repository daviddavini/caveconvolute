class Bat extends Entity{
  constructor(inCave, pos){
    super(inCave, pos);
    this.maxHp = 2;
    this.hp = this.maxHp;
    this.spd = 13;
    this.drawScale =1.4*18/16;
    this.size.set(new Vector(1, 1));
    this.drawSize.set(new Vector(this.drawScale*25/16, this.drawScale*18/16));
    this.drawPosChange = this.size.times(0.5).minus(this.drawSize.times(0.5));
    this.image = new Sprite(assetManager.getImage("bat"), this.drawPosChange, this.drawSize, 5, 10)
    this.defaultMoveStyle = new PathMove(this, this.inCave.caveMap.centralPath);
    this.setMoveStyle(this.defaultMoveStyle);
    this.numbOfPicks = 0;
    this.baseNumbOfPicks = 4;
    this.maxPicks = 7;
    new State("runAway", this, 8);
    new State("picking", this, 1, 2, true);
    new State("checkEntity", this, 0.2, 0.1, true).start();
  }
  addToCave(inCave){
    super.addToCave(inCave);
    this.inCave.entities.addToCategory(this, "bats");
    this.inCave.entities.addToCategory(this, "collidables");
    this.inCave.entities.addToCategory(this, "damagables");
    this.inCave.entities.removeFromCategory(this, "draw1");
    this.inCave.entities.addToCategory(this, "draw2");
  }
  looseHp(amt){
    super.looseHp(amt);
    if(this.throwItem){
      this.throwDir.set(this.dir);
      this.doThrowByGround(this.pos.y + this.size.y + 2);
    }
  }
  draw(canv, shiftX, shiftY){
    super.draw(canv, shiftX, shiftY);
    // canv.fillStyle = "blue";
    // for(var point of this.inCave.caveMap.centralPath){
    //   canv.fillRect((point.x+shiftX)*FSIZE, (point.y+shiftY)*FSIZE, 0.5*FSIZE, 0.5*FSIZE);
    // }
    if(DEBUGBOX){
      canv.fillStyle = "red";
      var point = this.inCave.caveMap.centralPath[this.moveStyle.pathIndex];
      canv.fillRect((point.x+shiftX)*FSIZE, (point.y+shiftY)*FSIZE, 0.5*FSIZE, 0.5*FSIZE);
    }
  }
}
Bat.prototype.collisionHandles = {
  players: function(overlapFixVec, entity, newCollision){
    if(!this.states.runAway.on && entity.moveStyle instanceof InputMove){
      this.prepareThrow(entity, new Vector(0,entity.drawSize.y*0.9));
      entity.moveStyle.buzzSize = 0.05;
    }
  }
};
Bat.prototype.stateHandleStarts = {
  holdingItem: function(){
    this.numbOfPicks = 0;
    this.states.picking.start();
    this.setMoveStyle(this.defaultMoveStyle);
    this.states.checkEntity.finish(0);
  },
  picking: function(){
    this.numbOfPicks++;
    this.throwItem.looseHp(0.33);
    if(this.numbOfPicks >= this.baseNumbOfPicks && Math.random() < this.numbOfPicks/this.maxPicks){
      this.throwDir.set(this.dir);
      this.doThrowByGround(this.pos.y + this.size.y + 2);
    }
  },
  checkEntity: function(){
    if(!this.states.runAway.on){
      this.setMoveStyle(new ChaseMove(this, "players", 4, 2, 0.3, 0.2));
    }
  }
};
Bat.prototype.stateHandleFinishes = {
  holdingItem: function(dt){
    this.states.picking.finish(dt);
    this.states.runAway.start();
  },
  runAway: function(dt){
    if(this.moveStyle instanceof PathMove)
      this.moveStyle.reverse();
    this.states.checkEntity.start();
  }
};

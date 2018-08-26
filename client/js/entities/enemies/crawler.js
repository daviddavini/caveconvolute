class Crawler extends Entity{
  constructor(inCave, pos, defInfo, groupId){
    super(inCave, pos);
    this.maxHp = 1;
    this.hp = this.maxHp;
    this.spd = 10;
    if(groupId){
      this.groupId = groupId;
      this.attack = this.groupId*0.3 + 0.3;
      this.sideLength =0.4+0.4*Math.random();
    } else{
      this.attack = 1;
      this.sideLength = 1+0.4*Math.random();
    }
    this.size.set(new Vector(this.sideLength, this.sideLength));
    this.drawSize.set(this.size);
    this.drawPosChange.set(this.drawSize.minus(this.size).times(0.5));
    this.images = {calm:new Sprite(assetManager.getImage("swarm"), this.drawPosChange, this.drawSize, 6, 12),
                  mad:new Sprite(assetManager.getImage("swarm"), this.drawPosChange, this.drawSize, 6, 12)};
    this.defaultMoveStyle = new BuzzMove(this, 8);
    this.setMoveStyle(this.defaultMoveStyle);

    this.makeShadow();

    this.numbOfChomps = 0;
    this.maxChomps = 7;
    new State("runAway", this, 1.5);
    new State("checkEntity", this, 0.1, 0.1, true).start();
  }
  addToCave(inCave){
    super.addToCave(inCave);
    this.inCave.entities.addToCategory(this, "crawlers");
    this.inCave.entities.addToCategory(this, "damagables");
    this.inCave.entities.addToCategory(this, "collidables");
    this.inCave.entities.addToCategory(this, "grounds");
  }
  setMoveStyle(moveStyle){
    if(moveStyle instanceof ChaseMove){
      this.image = this.images.mad;
    } else {
      this.image = this.images.calm;
    }
    super.setMoveStyle(moveStyle);
  }
}
Crawler.prototype.collisionHandles = {
  players: function(overlapFixVec, entity2, newCollision){
    if(newCollision){
      entity2.looseHp(this.attack);
      this.numbOfChomps++;
      if(this.numbOfChomps >= this.maxChomps){
        this.numbOfChomps = 0;
        this.states.runAway.start();
      }
    }
  },
  crawlers: function(overlapFixVec, entity, newCollision){
    entity.hitObstacle(overlapFixVec);
  }
};
Crawler.prototype.stateHandleStarts = {
  checkEntity: function(){
    if(this.states.runAway.on){
      this.setMoveStyle(new ChaseMove(this, "players", 10, 0.1, 0.2, 1, true));
    }else {
      this.setMoveStyle(new ChaseMove(this, "players", 5, 0.1, 0.2, 0.2));
    }
  },
  beingHurt: function(){
    this.setMoveStyle(new ChaseMove(this, "players", 10, 0.1, 0.2, 0.2));
  }
}
Crawler.prototype.stateHandleFinishes = {
}

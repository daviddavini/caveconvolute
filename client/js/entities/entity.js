class Entity {
  constructor(inCave, pos){
    this.id = Math.random();
    this.inCave = inCave;
    if(this.inCave)
      this.addToCave(inCave);
    this.pos = pos;
    this.posChange = new Vector(0,0);
    this.vel = new Vector(0,0);
    this.dir = new Vector(0,0);
    this.spd = 4;
    this.size = new Vector(1,1);
    this.weight = 1;
    this.defaultMoveStyle = new IdleMove(this);
    this.moveStyle = this.defaultMoveStyle;
    this.box = new Box(this.pos, this.size);
    this.drawPosChange = new Vector(0,0);
    this.drawSize = new Vector(1,1);
    this.image = new Sprite(assetManager.getImage("square"), this.drawPosChange, this.drawSize);
    this.maxMaxHp = 999999999;
    this.minMaxHp = 1;
    this.maxHp = 1;
    this.hp = this.maxHp;
    this.throwItem = null;
    this.throwDir = new Vector(0,0);
    this.throwUpAngleTan = 1;
    this.throwSpd = 5;
    this.model = false;
    this.isDead = false;
    this.states = {};
    this.thrower = null;
    new State("holdingItem", this);
    new State("beingHurt", this, 0.4);
    new State("dead", this);
  }
  makeShadow(){
    this.shadowSize = new Vector(this.size.x, this.size.x*7/16);
    this.shadowPosChange = new Vector((this.size.x-this.shadowSize.x)/2, (this.size.y-this.shadowSize.y/2));
    this.shadowImage = new Sprite(assetManager.getImage("shadow"), this.shadowPosChange, this.shadowSize);
  }
  sameAs(entity){
    return this.constructor === entity.constructor;
  }
  gainMaxHp(amt){
    this.maxHp += amt;
    if(this.maxHp > this.maxMaxHp){
      this.maxHp = this.maxMaxHp;
    }
  }
  isBenignTo(entity){
    return false;
  }
  looseMaxHp(amt, hitter){
    if(hitter.isBenignTo(this))
      return;
    this.maxHp -= amt;
    if(this.maxHp < this.minMaxHp){
      this.maxHp = this.minMaxHp;
    }
  }
  addedToInventory(entity){
  }
  removedFromInventory(entity){
  }
  makeModel(){
    this.model = true;
    this.inCave.entities.remove(this);
  }
  addToCave(inCave){
    this.inCave = inCave;
    this.inCave.entities.add(this);
    this.inCave.entities.addToCategory(this, "wallcollidables");
    this.inCave.entities.addToCategory(this, "updatables");
    this.inCave.entities.addToCategory(this, "draw1");
    this.inCave.addedEntity(this);
  }
  removeFromInCave(){
    this.inCave.entities.remove(this);
    this.inCave.removedEntity(this);
    this.inCave = null;
  }
  looseHp(amt){
    if(!this.states.beingHurt.on){
      this.states.beingHurt.start();
      this.hp -= amt;
    }
  }
  gainHp(amt){
    this.hp += amt;
    if(this.hp > this.maxHp){
      this.hp = this.maxHp;
    }
  }
  collect(entity){
    entity.addedToInventory(this);
    entity.pos.set(new Vector(0,0));
    return true;
  }
  useOnCollect(entity){
    return false;
  }
  update(dt){
    if(this.image instanceof Sprite){
      this.image.tick(dt);
    }
    for(var stateId in this.states){
      this.states[stateId].update(dt);
    }
    this.moveStyle.update(dt);
  }
  hitObstacle(overlapFixVec){
    this.box.fixOverlap(overlapFixVec);
    if(this.moveStyle instanceof FlyMove){
      this.moveStyle.finishFlight();
    }
  }
  drawImage(canv, image, shiftX, shiftY){
    if(image instanceof Sprite){
      image.draw(canv, shiftX, shiftY);
    } else if (image instanceof Image){
      console.log("archaic, shouldnt be called");
      canv.drawImage(image, Math.floor(FSIZE*(this.drawPosChange.x+shiftX)),
                                  Math.floor(FSIZE*(this.drawPosChange.y+shiftY)),
                                  Math.floor(this.drawSize.x*FSIZE), Math.floor(this.drawSize.y*FSIZE));
    } else {
      canv.fillStyle = image;
      canv.fillRect(FSIZE*(shiftX), FSIZE*(shiftY), FSIZE*this.size.x, FSIZE*this.size.y);
    }
  }
  drawShadow(canv, shiftX, shiftY){
    this.shadowImage.draw(canv, shiftX, shiftY);
  }
  draw(canv, shiftX, shiftY){
    if(this.shadowImage){
      canv.globalAlpha *= 0.3;
      this.drawImage(canv, this.shadowImage, this.pos.x+shiftX, this.pos.y+shiftY);
      canv.globalAlpha /= 0.3;
    }
    this.drawImage(canv, this.image, this.pos.x+shiftX, this.pos.y+shiftY);
    if(this.states.beingHurt.on || this.states.dead.on){
      this.drawHurtShade(canv, shiftX, shiftY);
    }
    if(DEBUGBOX){
      canv.rect((this.pos.x+shiftX)*FSIZE, (this.pos.y+shiftY)*FSIZE, this.size.x*FSIZE, this.size.y*FSIZE);
      canv.stroke();
    }
  }
  drawHurtShade(canv, shiftX, shiftY){
    canv.globalAlpha = 0.2;
    canv.fillStyle = "red";
    canv.fillRect(FSIZE*(this.pos.x+shiftX), FSIZE*(this.pos.y+shiftY), FSIZE*this.size.x, FSIZE*this.size.y);
    canv.globalAlpha = 1;
  }
  flipFlop(connector){
    this.removeFromInCave();
    var connectorShift = connector.getShift();
    this.pos.take(connectorShift);
    this.addToCave(connector.connectedCave);
    if(this.moveStyle.flipFlop){
      this.moveStyle.flipFlop(connectorShift);
    }
  }
  prepareThrow(throwItem, carryPosChange){
    this.throwItem = throwItem;
    this.throwItem.setMoveStyle(new CarryMove(this.throwItem, this, carryPosChange, this.throwDir));
    this.states.holdingItem.start();
  }
  doThrowByAim(aimPos){
    if(this.throwItem){
      this.states.holdingItem.finish();
      this.throwItem.setMoveStyle(new FlyMove(this.throwItem, this, this.throwSpd, this.throwDir, this.pos.y+this.size.y/2, aimPos));
      this.throwItem = null;
    }
  }
  doThrowByGround(groundHeight){
    if(this.throwItem){
      this.states.holdingItem.finish();
      this.throwItem.setMoveStyle(new FlyMove(this.throwItem, this, this.throwSpd, this.throwDir, groundHeight));
      console.log(this.throwItem);
      this.throwItem = null;
    }
  }
  setMoveStyle(moveStyle){
    this.moveStyle = moveStyle;
  }
  handleCollisions(entities){
    /**WARNING: doesnt support extended class heirarchies!!!!!**/
    //goes down inheritance chain, handling each collision function
    for(var p = Object.getPrototypeOf(this); p.stateHandleStarts; p = Object.getPrototypeOf(p)){
      for(var cat in p.collisionHandles){
        for(var entity2 of entities.get(cat)){
          if(this === entity2 || !entities.checkInCat(entity2, "collidables"))
            continue;
          var overlapFixVec = this.box.overlapFixByEntry(this.posChange, entity2.box);
          if(overlapFixVec){
            p.collisionHandles[cat].call(this, overlapFixVec.mult(-1), entity2, true);
            continue;//to make sure entity is only flagged for one collision
          }
          var overlapFixVec2 = entity2.box.overlapFixByEntry(entity2.posChange, this.box);
          if(overlapFixVec2){
            p.collisionHandles[cat].call(this, overlapFixVec2, entity2, true);
            continue;
          }
          var overlapFixVec4 = this.box.overlapFixByEntry(this.posChange, entity2.box.posPlus(entity2.posChange.mult(-1)));
          if(overlapFixVec4){
            p.collisionHandles[cat].call(this, overlapFixVec4.mult(-1), entity2, true);
            continue;//to make sure entity is only flagged for one collision
          }
          var overlapFixVec3 = entity2.box.overlapFixBySmallest(this.box);
          if(overlapFixVec3){
            p.collisionHandles[cat].call(this, overlapFixVec3, entity2, false);
            continue;
          }
        }
      }
    }
  }
  handleStateStart(stateName){
    for(var p = Object.getPrototypeOf(this); p.stateHandleStarts; p = Object.getPrototypeOf(p)){
      if(p.stateHandleStarts[stateName])
        p.stateHandleStarts[stateName].call(this);
    }
  }
  handleStateFinish(stateName, dt){
    for(var p = Object.getPrototypeOf(this); p.stateHandleFinishes; p = Object.getPrototypeOf(p)){
      if(p.stateHandleFinishes[stateName])
        p.stateHandleFinishes[stateName].call(this, dt);
    }
  }
}
//so that handle collisions doesnt run into errors
//WARNING: must also exist in daughter classes
Entity.prototype.collisionHandles = {};
Entity.prototype.stateHandleStarts = {
  dead: function(){
    this.inCave.lootSpawn(this);
    if(!(this instanceof Player))
      this.removeFromInCave();
  }
};
Entity.prototype.stateHandleFinishes = {
  beingHurt: function(dt){
    if(this.hp <= 0){
      this.states.dead.start();
    }
  }
};

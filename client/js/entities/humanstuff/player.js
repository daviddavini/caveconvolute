class Player extends Entity{
  constructor(inCave, pos, playerInfo){
    super(inCave, pos);
    this.cameraPos = this.pos;
    this.hookConnectors = {};
    this.defaultSpd = playerInfo.spd;
    this.slowSpd = this.defaultSpd;
    this.fastSpd = 2*this.slowSpd;
    this.spd = this.slowSpd;
    this.dir = new Vector(0,0);
    this.doingThrow = false;
    this.inventory = new Inventory(this, playerInfo);
    this.isDead = false;
    this.maxMaxHp = 15;
    this.minMaxHp = 3;
    this.maxHp = playerInfo.maxHp;
    this.throwSpd = playerInfo.throwSpd;
    this.hp = playerInfo.hp;
    this.drawSize.set(this.size.plus(new Vector(0, 3/8)));
    this.images = {walkingdown:new Sprite(assetManager.getImage("playerwalkingdown"),
                    new Vector(0, -3/8), this.drawSize, 4, 8),
                  walkingup:new Sprite(assetManager.getImage("playerwalkingup"),
                    new Vector(0, -3/8), this.drawSize, 4, 8),
                  walkingright:new Sprite(assetManager.getImage("playerwalkingright"),
                    new Vector(0, -3/8), this.drawSize, 4, 8),
                  walkingleft:new Sprite(assetManager.getImage("playerwalkingleft"),
                    new Vector(0, -3/8), this.drawSize, 4, 8),
                  front:new Sprite(assetManager.getImage("playerwalkingdown"),
                    new Vector(0, -3/8), this.drawSize, 4, 0)};
    this.makeShadow();
    this.image = this.images.frontwalk;
    this.itemPickupDist = 2;
    this.caveFadeFullPercent = 0.1;
    this.caveFadeDistPercent = 0.55;

    this.defaultMoveStyle = new InputMove(this);
    this.setMoveStyle(this.defaultMoveStyle);

    new State("walking", this).start();
    new State("slowwalking", this, 0.8);
    new State("grabbing", this);
  }
  getInfo(){
    var invInfo = this.inventory.getInfo();
    var playerInfo = {
      spd: this.defaultSpd,
      maxHp: this.maxHp,
      hp: this.hp,
      throwSpd: this.throwSpd,
      fuelSlotNumb: invInfo.fuelRingInfo.slotNumb,
      rockSlotNumb: invInfo.rockRingInfo.slotNumb,
      itemSlotNumb: invInfo.itemRingInfo.slotNumb,
      fuelInfos: invInfo.fuelRingInfo.defInfos,
      rockInfos: invInfo.rockRingInfo.defInfos,
      itemInfos: invInfo.itemRingInfo.defInfos
    };
    console.log(playerInfo);
    return playerInfo;
  }
  pickupItems(){
    var itemClosest = null;
    var dist = this.itemPickupDist;
    for(var item of this.inCave.entities.get("items")){
      if(this.box.getCenter().dist(item.box.getCenter()) < dist){
        dist = this.box.getCenter().dist(item.box.getCenter());
        itemClosest = item;
      }
    }
    if(itemClosest && this.collect(itemClosest)){
      itemClosest.removeFromInCave();
    }
  }
  addToCave(inCave){
    super.addToCave(inCave);
    this.inCave.entities.addToCategory(this, "players");
    this.inCave.entities.addToCategory(this, "grounds");
    this.inCave.entities.addToCategory(this, "damagables");
    this.inCave.entities.addToCategory(this, "collidables");
  }
  addItemSlots(itemClass, amt){
    this.inventory.addItemSlots(itemClass, amt);
  }
  collect(item){
    if(item.useOnCollect(this)){
      return true;
    }
    if(this.inventory.add(item)){
      return super.collect(item);
    }
    return false;
  }
  // draw(canv){
  //   super.draw(canv);
  //   if(this.pressingThrow){
  //   }
  // }
  displayScreen(canv){
    var invShift = this.inventory.getShift();
    this.displayGame(canv, invShift + NOWWINDOWSIZE/2-this.cameraPos.x-this.size.x/2,
                      NOWWINDOWSIZE/2-this.cameraPos.y-this.size.y/2);
    //canv.globalAlpha = 0.8;
    //canv.drawImage(this.darknessImage, INVWIDTH, 0, canv.canvas.width-INVWIDTH, canv.canvas.height);
    //canv.globalAlpha = 1;
    Fire.drawLight(canv);
    this.inventory.draw(canv);
    if(this.inCave.type === "link"){
      var blackPercent = 0.33;
      var percent = this.inCave.caveMap.getPercentTraveled(this.pos);
      var alpha = bounded(0,1, (percent/(1-blackPercent)));
      if(alpha < 1){
        canv.globalAlpha = alpha;
        canv.fillStyle = "#0F1521";
        canv.fillRect(0, 0, canv.canvas.width, canv.canvas.height);
        canv.globalAlpha = 1;
      }else{
        this.inCave.cluster.finishLevel(this.getInfo());
      }
    }else if(this.inCave.type === "startlink"){
      var blackPercent = 0.33;
      var percent = 1-this.inCave.caveMap.getPercentTraveled(this.pos);
      var alpha = bounded(0,1, (percent/(1-blackPercent)));
      canv.globalAlpha = alpha;
      canv.fillStyle = "#0F1521";
      canv.fillRect(0, 0, canv.canvas.width, canv.canvas.height);
      canv.globalAlpha = 1;
    }
    if(this.states.dead.on){
      canv.fillStyle = "white";
      canv.font = "60px ArcadeClassic";
      var m1 = "you died.";
      var m2 = "refresh   the   page   to   try   again";
      canv.fillText(m1, INVWIDTH+CSIZE/2 - canv.measureText(m1).width/2, CSIZE/2);
      canv.font = "30px ArcadeClassic";
      canv.fillText(m2, INVWIDTH+CSIZE/2 - canv.measureText(m2).width/2, CSIZE/2 +50);
    }
    //ctx.fillStyle = "purple";
    //ctx.fillText("cave: "+this.inCave.number,430+INVWIDTH,100);
    //ctx.fillStyle = "white";
    //ctx.fillText("Game by David Davini.  Graphics and Music by Dany Weiss.",10+INVWIDTH,CSIZE);
  }
  drawHurtShade(canv, shiftX, shiftY){
    canv.globalAlpha = 0.5;
    canv.fillStyle = "#4c1414";
    canv.fillRect(0, 0, canv.canvas.width, canv.canvas.height);
    canv.globalAlpha = 1;
  }
  getCaveFadeAlpha(hookConnector){
    if(this.pos.dist(hookConnector.pos)/(CONNECTWINDOWSIZE) > this.caveFadeFullPercent){
      var a = ((this.pos.dist(hookConnector.pos)/CONNECTWINDOWSIZE)-this.caveFadeFullPercent)/
        (this.caveFadeDistPercent-this.caveFadeFullPercent);
      return bounded(0,1,a);
    }
    return 0;
  }
  drawHookCaveFade(canv, hookConnector, fullPercent, distPercent){
    var caveFadeAlpha = this.getCaveFadeAlpha(hookConnector);
    if(caveFadeAlpha){
      canv.globalAlpha = caveFadeAlpha;
      canv.fillStyle = "black";
      canv.fillRect(0,0, canv.canvas.width, canv.canvas.height);
      canv.globalAlpha = 1;
    }
    // if(this.pos.dist(hookConnector.pos)/(CONNECTWINDOWSIZE) > fullPercent){
    //   var a = ((this.pos.dist(hookConnector.pos)/CONNECTWINDOWSIZE)-fullPercent)/(distPercent-fullPercent);
    //   canv.globalAlpha = bounded(0,1,a);
    //   canv.fillStyle = "black";
    //   canv.fillRect(0,0, canv.canvas.width, canv.canvas.height);
    //   canv.globalAlpha = 1;
    // }
  }
  displayGame(canv, shiftX, shiftY){
    for(var id in this.hookConnectors){
      var hookConnectorShift = this.hookConnectors[id].getShift();
      if(!this.hookConnectors[id].connectedCave)
        console.log("uh oh, nopes");
      this.hookConnectors[id].connectedCave.drawBack(canv, hookConnectorShift.x+shiftX, hookConnectorShift.y+shiftY, this.pos.minus(hookConnectorShift));

      this.drawHookCaveFade(canv, this.hookConnectors[id], 0.1, 0.55);
    }
    this.inCave.drawBack(canv, shiftX, shiftY, this.pos.copy());
    for(var id in this.hookConnectors){
      var hookConnectorShift = this.hookConnectors[id].getShift();

      var caveFadeAlpha = this.getCaveFadeAlpha(this.hookConnectors[id]);
      if(caveFadeAlpha)
        canv.globalAlpha = 1-caveFadeAlpha;
      this.hookConnectors[id].connectedCave.drawFront(canv, hookConnectorShift.x+shiftX, hookConnectorShift.y+shiftY, this.pos.minus(hookConnectorShift));
      canv.globalAlpha = 1;
    }
    this.inCave.drawFront(canv, shiftX, shiftY, this.pos.copy());
  }
  hookOnto(connector){
    this.hookConnectors[connector.id] = connector;
  }
  update(dt){
    if(this.moveStyle instanceof FlyMove){
      this.image = this.images.front;
    } else {
      if(this.vel.y < 0){
        this.image = this.images.walkingup;
      } else if(this.vel.y > 0){
        this.image = this.images.walkingdown;
      } else if(this.vel.x < 0){
        this.image = this.images.walkingleft;
      } else if(this.vel.x > 0){
        this.image = this.images.walkingright;
      } else{
        this.image = this.images.front;
      }
    }
    if(DEBUG)
      this.hp = this.maxHp;
    this.inventory.update(dt);
    if(DEBUGEND){
      this.inCave.cluster.finishLevel(this.getInfo());
      DEBUGEND = !DEBUGEND;
    }
    super.update(dt);
  }
  unhookFrom(connector){
    delete this.hookConnectors[connector.id];
  }
  flipFlop(connector){
    // for(var id in this.inCave.caveMap.connectors){
    //   delete this.inCave.caveMap.connectors[id].connectedCave.adjacentPlayers[this.id];
    // }
    for(var id in this.hookConnectors){
      if(this.hookConnectors[id].parentCave === connector.parentCave)
        this.unhookFrom(this.hookConnectors[id]);
    }
    super.flipFlop(connector);
    this.unhookFrom(connector);
    this.hookOnto(connector.connectedConnector);
    if(this.states.walking.on){
      this.states.walking.finish();
    }
  }
  prepareThrow(){
    this.throwItem = this.inventory.getSelectedItem();
    if(this.throwItem){
      this.throwItem.removedFromInventory(this);
      this.throwItem.addToCave(this.inCave);
      super.prepareThrow(this.throwItem, new Vector(0, -this.throwItem.drawSize.y*0.9));
    }else{
      //console.log("no throw item");
    }
  }
  setMoveStyle(moveStyle){
    if(moveStyle instanceof CarryMove){
      this.cameraPos = moveStyle.straightEntityPos;
      this.inCave.entities.removeFromCategory(this, "collidables");
    } else if (moveStyle instanceof FlyMove){
      this.cameraPos = this.pos;
    } else if (moveStyle instanceof InputMove){
      this.cameraPos = this.pos;
      this.inCave.entities.addToCategory(this, "collidables");
    }
    super.setMoveStyle(moveStyle);
  }
}

Player.prototype.collisionHandles = {
};
Player.prototype.stateHandleStarts = {
  dead: function(){
    this.moveStyle = new IdleMove(this);
    this.color = "purple";
  },
  walking: function(){
    var walkingDir = new Vector(0, -1);
    this.vel.set(walkingDir.times(this.spd));
    this.setMoveStyle(new PhysicsMove(this));
  },
  slowwalking: function(){
    var walkingDir = new Vector(0, -1);
    this.vel.set(walkingDir.times(this.spd/2));
  }
};
Player.prototype.stateHandleFinishes = {
  walking: function(dt){
    this.states.slowwalking.start();
  },
  slowwalking: function(dt){
    this.vel.set(new Vector(0,0));
    this.setMoveStyle(this.defaultMoveStyle);
  }
};

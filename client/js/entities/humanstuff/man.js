class Man extends Entity{
  constructor(inCave, pos, defInfo){
    super(inCave, pos);
    this.maxHp = 999999;
    this.hp = this.maxHp;
    this.spd = 2;
    this.type = defInfo.type;
    this.valueRange = defInfo.valueRange;
    this.showTrade = true;

    this.size.set(new Vector(1.5,1.5));
    this.drawPosChange.set(new Vector(0, -1));
    this.drawSize.set(new Vector(1.5,2.5));

    this.playingMessage = null;
    this.messageTextFont = "30px ArcadeClassic";

    this.defaultMoveStyle = new IdleMove(this);
    this.setMoveStyle(this.defaultMoveStyle);

    //Trade Bubble Configuration
    this.itemImageSize = 30;
    this.textColor = "#87BBFF";
    this.textFont = "21px Arial";
    this.smallBubbleSize = new Vector(95, 70);
    this.bigBubbleSize = new Vector(133, 120);
    //coords for item by bubble
    this.firstItemCoords = new Vector(30, 30);
    this.secondItemCoords = new Vector(69, 79);
    this.textCoordsShift = new Vector(28, 8);

    this.smallBubbleImage = new Sprite(assetManager.getImage("tradebubble"),
        new Vector(0,0),this.smallBubbleSize.copy());
    this.bigBubbleImage = new Sprite(assetManager.getImage("tradebubblebig"),
        new Vector(0,0),this.bigBubbleSize.copy());

    this.inventory = [];
    this.junkInventory = [];
    // this.essentialTradeInfos = [
    //   {className:Eye, defInfo:null},
    //   {className:Flower, defInfo:null},
    //   {className:Wing, defInfo:null},
    // ]
    this.receiveTradeInfos = [
      {className:'Eye', defInfo:{}},
      {className:'Flower', defInfo:{}},
      {className:'Wing', defInfo:{}},
      {className:'Slime', defInfo:{}},
      {className:'Gem', defInfo:{}}
    ];
    // for(var a of this.receiveTradeInfos){
    //   console.log(a.className, this.getTradeValue(a));
    // }
    this.giveTradeInfos = [
      {className:'Gem', defInfo:{}},
      {className:'Fuel', defInfo:{}},
      {className:'Rock', defInfo:{}},
      {className:'Stone', defInfo:{type:"speed"}},
      {className:'Stone', defInfo:{type:"strength"}},
      {className:'Holder', defInfo:{className:Entity}},
      {className:'Holder', defInfo:{className:Rock}},
      {className:'Holder', defInfo:{className:Fuel}},
      {className:'Heart', defInfo:{}}
    ];
    this.takeTradeInfos = [
      {className:'Rock', requiredAmt:1, defInfo:{}}
    ];
    this.trades = [];

    if(this.type === "trader"){
      //NEEDS:  tradeInfos (way, class, defInfo)
      this.images = assetManager.getImagePack("monk");
      this.image = new Sprite(this.images[randInt(0,1+1)], this.drawPosChange, this.drawSize);
      var height = 2.5;
      this.size.set(new Vector(1,height-1));
      this.drawSize.set(new Vector(height*32/40, height));
      this.drawPosChange.set(new Vector(this.size.x/2 - this.drawSize.x/2, this.size.y-this.drawSize.y));

      if(defInfo.valueRange){
        this.addRandTradeByValueRange(defInfo.valueRange, defInfo.way);
      } else{
        console.log("yikes")
        for(var tradeInfo of defInfo.tradeInfos){
          if(tradeInfo.way === "give")
            this.addGiveTrade(tradeInfo.className, tradeInfo.defInfo);
          else if(tradeInfo.way === "receive")
            this.addReceiveTrade(tradeInfo.className, tradeInfo.defInfo);
        }
      }

      this.tradeStatic = true; //WARNING: IMPORTANT!

    }else if (this.type === "keeper"){
      //NEEDS:  gate, tradeInfos (class, defInfo)
      var height = 3;
      this.size.set(new Vector(1,height-1));
      this.drawSize.set(new Vector(height, height));
      this.drawPosChange.set(new Vector(this.size.x/2 - this.drawSize.x/2, this.size.y-this.drawSize.y));
      this.image = new Sprite(assetManager.getImage("gatekeeper"), this.drawPosChange, this.drawSize, 3, 6);
      this.gate = defInfo.gate;
      this.walkDir = new Vector(1,0);

      if(defInfo.valueRange){
        this.addRandTakeByValueRange(defInfo.valueRange);
      }else {
        for(var takeInfo of defInfo.takeInfos){
          this.addTrade(takeInfo.className, takeInfo.requiredAmt, takeInfo.defInfo);
        }
      }
      this.tradeStatic = false;

    }else if(this.type === "banker"){
      //NEEDS:  exlevel, exdir
      this.images = assetManager.getImagePack("monk");
      this.image = new Sprite(assetManager.getImage("trader"), this.drawPosChange, this.drawSize);
      var height = 2.5;
      this.size.set(new Vector(1,height-1));
      this.drawSize.set(new Vector(height*32/40, height));
      this.drawPosChange.set(new Vector(this.size.x/2 - this.drawSize.x/2, this.size.y-this.drawSize.y));

      this.exlevel = defInfo.exlevel;
      this.exdir = defInfo.exdir;
      if(this.exdir === "down"){
        this.image = new Sprite(this.images[1], this.drawPosChange, this.drawSize);
      }else if(this.exdir === "up"){
        this.image = new Sprite(this.images[0], this.drawPosChange, this.drawSize);
      }

      if(this.exlevel === 1 && this.exdir === "up"){
        this.addTrade('Coin', 3, {level:1}, 'Coin', 1, {level:2});
      } else if(this.exlevel === 1 && this.exdir === "down"){
        this.addTrade('Coin', 1, {level:2}, 'Coin', 3, {level:1});
      } else if(this.exlevel === 2 && this.exdir === "up"){
        this.addTrade('Coin', 3, {level:2}, 'Coin', 1, {level:3});
      } else if(this.exlevel === 2 && this.exdir === "down"){
        this.addTrade('Coin', 1, {level:3}, 'Coin', 3, {level:2});
      }
      this.tradeStatic = true;
    }
    this.makeShadow();

    this.nextTrade();

    new State("acceptBuffer", this, 1);
    new State("changeTradeBuffer", this, 2);
    new State("finishTrading", this);
    new State("walking", this, 5.3/this.spd);
    new State("openDoorBuffer", this, 1.5);
    new State("rejectBuffer", this, 0.5);
    new State("giveBuffer", this, 0.5);
    new State("giveProcessBuffer", this, 1);
  }
  getInfo(){
    return {
      type: this.type,
      valueRange: this.valueRange,
      exlevel: this.exlevel,
      exdir: this.exdir,
    };
  }
  addToCave(inCave){
    super.addToCave(inCave);
    this.inCave.entities.addToCategory(this, "mans");
    this.inCave.entities.addToCategory(this, "collidables");
    this.inCave.entities.addToCategory(this, "grounds");
  }
  sameAs(entity){
    if(super.sameAs(entity)){
      return this.type === entity.type;
    }
    return false;
  }
  isBenignTo(entity){
    return true;
  }
  getTradeValue(tradeInfo){
    var value = tradeInfo.className.value;
    //some level is input-dependent, some is constant (Gem)
    if(tradeInfo.defInfo && tradeInfo.defInfo.level){
      value *= tradeInfo.defInfo.level;
    }else if(tradeInfo.className.level){
      value *= tradeInfo.className.level;
    }
    if(tradeInfo.requiredAmt)
      value *= tradeInfo.requiredAmt;
    return value;
  }
  addRandTakeByValueRange(valueRange){
    var validTradeInfos = [];
    var tradeInfos = this.takeTradeInfos;
    for(var tradeInfo of tradeInfos){
      var value = this.getTradeValue(tradeInfo);
      if(value >= valueRange[0] && value <= valueRange[1]){
        validTradeInfos.push(tradeInfo);
      }
    }
    var chosenTradeInfo = validTradeInfos[randInt(0, validTradeInfos.length)];
    this.addTrade(chosenTradeInfo.className, chosenTradeInfo.requiredAmt, chosenTradeInfo.defInfo);
  }
  addRandTradeByValueRange(valueRange, way){
    var validTradeInfos = [];
    if(way === "receive"){
      var tradeInfos = this.receiveTradeInfos;
    }else if(way === "give"){
      var tradeInfos = this.giveTradeInfos;
    }
    for(var tradeInfo of tradeInfos){
      var value = this.getTradeValue(tradeInfo);
      if(value >= valueRange[0] && value <= valueRange[1]){
        validTradeInfos.push(tradeInfo);
      }
    }
    var chosenTradeInfo = validTradeInfos[randInt(0, validTradeInfos.length)];
    if(way === "receive"){
      this.addReceiveTrade(chosenTradeInfo.className, chosenTradeInfo.defInfo);
    } else if(way === "give"){
      this.addGiveTrade(chosenTradeInfo.className, chosenTradeInfo.defInfo);
    }
  }
  randValueFrom(avg){
    var chance = Math.random();
    var list = [1,3,8,3,1];
    var midIndex = 2;
    var sum = 0;
    for(var l of list)
      sum += l;
    var sum2 = 0;
    for(var i = 0; i < list.length; i++){
      sum2 += list[i];
      if(chance < sum2/sum){
        return Math.max(1, avg+(i-midIndex));
      }
    }
  }
  amtsFrom(value){
    if(value > 1){
      var amt2 = 1;
      var amt1 = this.randValueFrom(value);
    } else if(value < 1){
      var amt2 = this.randValueFrom(1/value);
      var amt1 = 1;
    } else if(value === 1){
      // if(Math.random()<0.5){
      //   var amt2 = 1;
      //   var amt1 = this.randValueFrom(value);
      // } else{
      //   var amt2 = this.randValueFrom(1/value);
      //   var amt1 = 1;
      // }
      var amt1 = 1;
      var amt2 = 1;
    }
    return {amt1:amt1, amt2:amt2};
  }
  resetTrade(trade){
    trade.receives.amt = 0;
    trade.gives.amt = 0;
    return trade;
  }
  nextTrade(){
    //this.trade = this.trades.splice(randInt(0,this.trades.length), 1);
    this.trade = this.trades.shift();
    return this.trade;
  }
  addReceiveTrade(className, definingParam){
    var classModel = new (eval(className))(this.inCave, new Vector(0,0), definingParam);
    var amts = this.amtsFrom(classModel.value);
    var giveAmt = amts.amt1;
    var requiredAmt = amts.amt2;
    //classModel.value = Math.pow(3, classModel.level-1);
    this.addTrade(className, requiredAmt, definingParam, 'Coin', giveAmt, {level:classModel.level});
  }
  addGiveTrade(className, definingParam){
    var classModel = new (eval(className))(this.inCave, new Vector(0,0), definingParam);
    var amts = this.amtsFrom(classModel.value);
    var giveAmt = amts.amt2;
    var requiredAmt = amts.amt1;
    //classModel.value = Math.pow(3, classModel.level-1);
    this.addTrade('Coin', requiredAmt, {level:classModel.level}, className, giveAmt, definingParam);
  }
  addTrade(className, requiredAmt, definingParam, giveClassName, giveAmt, giveDefiningParam){
    var classModel = new (eval(className))(this.inCave, new Vector(0,0), definingParam);
    classModel.makeModel();
    if(giveClassName){
      var giveClassModel = new (eval(giveClassName))(this.inCave, new Vector(0,0), giveDefiningParam);
      giveClassModel.makeModel();
      var giveInventory = [];
      for(var i = 0; i < giveAmt; i++){
        giveInventory.push(new (eval(giveClassName))(this.inCave, new Vector(0,0), giveDefiningParam));
        super.collect(giveInventory[i]);
      }
    }
    this.trades.push({
      receives: {className:className, classModel:classModel, requiredAmt:requiredAmt, amt:0},
      gives: giveClassName?{className:giveClassName, classModel:giveClassModel,
        requiredAmt:giveAmt, amt:0, inventory:giveInventory} : null,
    });
  }
  collect(item){
    if(this.trade){
      if(item.sameAs(this.trade.receives.classModel) && this.trade.receives.amt<this.trade.receives.requiredAmt){
        this.trade.receives.amt++;
        if(this.trade.receives.amt >= this.trade.receives.requiredAmt){
          console.log("accept");
          if(this.trade.gives && this.trade.gives.inventory.length){
            this.states.giveProcessBuffer.start();
          }else{
            this.states.acceptBuffer.start();
          }
        }
        this.inventory.push(item);
        return super.collect(item);
      }
      console.log("rejecting");
      if(!(item.moveStyle instanceof FlyMove && item.thrower === this)){
        this.states.rejectBuffer.start();
        this.junkInventory.push(item);
        return super.collect(item);
      }
    }
    return false;
  }
  update(dt){
    if(this.trade){
      if(this.trade.receives)
        this.trade.receives.classModel.image.tick(dt);
      if(this.trade.gives)
        this.trade.gives.classModel.image.tick(dt);
    }
    super.update(dt);
  }
  throwFromInventory(inventory){
    this.throwItem = inventory.shift();
    this.throwItem.removedFromInventory(this);
    this.throwItem.addToCave(this.inCave);
    this.prepareThrow(this.throwItem, new Vector(0,0));
    this.throwDir.set(Vector.randUnitBetween(Math.PI*(1/4), Math.PI*(3/4)));
    this.doThrowByGround(this.pos.y + this.size.y);
  }
  drawTradePart(canv, shiftX, shiftY, bubbleSize, tradeSub, itemCoords){
    tradeSub.classModel.image.drawStraight(canv,
            (this.pos.x+this.drawPosChange.x+shiftX+this.drawSize.x/2)*FSIZE -bubbleSize.x/2 + itemCoords.x,
            (this.pos.y+this.drawPosChange.y+shiftY)*FSIZE -bubbleSize.y + itemCoords.y, this.itemImageSize);
    canv.fillStyle = this.textColor;
    canv.font=this.textFont;
    canv.fillText("x"+(tradeSub.requiredAmt-tradeSub.amt),
      (this.pos.x+this.drawPosChange.x+shiftX+this.drawSize.x/2)*FSIZE -bubbleSize.x/2 +itemCoords.x+this.textCoordsShift.x,
      (this.pos.y+this.drawPosChange.y+shiftY)*FSIZE -bubbleSize.y +itemCoords.y+this.textCoordsShift.y);
  }
  drawTrade(canv, shiftX, shiftY){
    if(this.trade.gives){
      this.bigBubbleImage.drawStraight(canv,
        (this.pos.x+this.drawPosChange.x+shiftX+this.drawSize.x/2)*FSIZE,
        (this.pos.y+this.drawPosChange.y+shiftY)*FSIZE-(this.bigBubbleSize.y/2),
        this.bigBubbleSize.x);
      //this.givebubbleimage.draw(canv, this.pos.x+shiftX, this.pos.y+shiftY);
      this.drawTradePart(canv, shiftX, shiftY, this.bigBubbleSize, this.trade.gives, this.secondItemCoords);
      this.drawTradePart(canv, shiftX, shiftY, this.bigBubbleSize, this.trade.receives, this.firstItemCoords);
    }else{
      //this.bubbleimage.draw(canv, this.pos.x+shiftX, this.pos.y+shiftY);
      this.smallBubbleImage.drawStraight(canv,
        (this.pos.x+this.drawPosChange.x+shiftX+this.drawSize.x/2)*FSIZE,
        (this.pos.y+this.drawPosChange.y+shiftY)*FSIZE-(this.smallBubbleSize.y/2),
        this.smallBubbleSize.x);
      this.drawTradePart(canv, shiftX, shiftY, this.smallBubbleSize, this.trade.receives, this.firstItemCoords);
    }
  }
  drawMessage(canv){
    canv.fillStyle = this.textColor;
    canv.font=this.messageTextFont;
    canv.fillText(this.playingMessage, INVWIDTH+CSIZE/2-canv.measureText(this.messageTextFont).width/2, CSIZE*(3/4));
  }
  draw(canv, shiftX, shiftY){
    if(this.trade){
      this.drawTrade(canv, shiftX, shiftY);
    }
    if(this.playingMessage){
      this.drawMessage(canv);
    }
    super.draw(canv, shiftX, shiftY);
  }

}
Man.prototype.collisionHandles = {
  grounds: function(overlapFixVec, entity2, newCollision){
    if(this.moveStyle instanceof IdleMove){
      entity2.hitObstacle(overlapFixVec);
    }
  },
  items: function(overlapFixVec, entity, newCollision){
    if(this.collect(entity)){
      entity.removeFromInCave();
    }
  }
};
Man.prototype.stateHandleStarts = {
  walking: function(){
    this.vel.set(this.walkDir.times(this.spd));
    this.setMoveStyle(new PhysicsMove(this));
    this.playingMessage = "well done, traveler.";
  },
};
Man.prototype.stateHandleFinishes = {
  acceptBuffer: function(dt){
    console.log("accept2");
    this.showTrade = false;
    this.states.changeTradeBuffer.start();
  },
  giveBuffer: function(dt){
    console.log("giving");
    this.throwFromInventory(this.trade.gives.inventory);
    this.trade.gives.amt++;
    if(this.trade.gives.inventory.length){
      this.states.giveBuffer.start();
    }else{
      if(this.tradeStatic){
        this.resetTrade(this.trade);
      } else{
        this.states.acceptBuffer.start();
      }
    }
  },
  giveProcessBuffer: function(dt){
    this.states.giveBuffer.start();
  },
  rejectBuffer: function(dt){
    console.log("rejecting2", this.junkInventory);
    this.throwFromInventory(this.junkInventory);
    if(this.junkInventory.length){
      this.states.rejectBuffer.start();
    }
  },
  changeTradeBuffer: function(dt){
    this.showTrade = true;
    console.log("change2");
    if(this.trades.length){
      this.nextTrade();
    } else{
      if(this.type === "keeper"){
        this.states.walking.start();
      }else {
        this.states.finishTrading.start();
      }
    }
  },
  walking: function(dt){
    this.vel.set(new Vector(0,0));
    this.setMoveStyle(new IdleMove(this));
    this.states.openDoorBuffer.start();
  },
  openDoorBuffer: function(dt){
    if(this.gate){
      this.gate.open();
    }
  }
};

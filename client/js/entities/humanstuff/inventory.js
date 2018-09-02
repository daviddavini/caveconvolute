class Inventory {
  constructor(entity, playerInfo){
    this.entity = entity;
    this.width = INVWIDTH;
    this.height = CSIZE;
    this.color = "#253245";
    this.lightcolor = "#425C7D";
    this.bibfaded = assetManager.getImage("bibfaded");
    this.bibempty = assetManager.getImage("bibempty");
    this.bibred = assetManager.getImage("bibred");
    this.offAlpha = 0.15;
    this.basePercent = 0.07;
    this.baseTextPercent = 0.01;
    this.namePercent = 0.03;
    this.levelPercent = 0.06;
    this.healthBarBottomPercent = 0.95;
    this.freeSpots = [new ItemRing(Entity, 1,1, new Vector(this.width*(0.34),this.height*(this.basePercent+0.42)), this.offAlpha),
                      new ItemRing(Entity, 1,1, new Vector(this.width*(0.34),this.height*(this.basePercent+0.48)), this.offAlpha),
                      new ItemRing(Entity, 1,1, new Vector(this.width*(0.34),this.height*(this.basePercent+0.54)), this.offAlpha),
                      new ItemRing(Entity, 1,1, new Vector(this.width*(0.34),this.height*(this.basePercent+0.60)), this.offAlpha),
                      new ItemRing(Entity, 1,1, new Vector(this.width*(0.66),this.height*(this.basePercent+0.42)), this.offAlpha),
                      new ItemRing(Entity, 1,1, new Vector(this.width*(0.66),this.height*(this.basePercent+0.48)), this.offAlpha),
                      new ItemRing(Entity, 1,1, new Vector(this.width*(0.66),this.height*(this.basePercent+0.54)), this.offAlpha),
                      new ItemRing(Entity, 1,1, new Vector(this.width*(0.66),this.height*(this.basePercent+0.60)), this.offAlpha)];
    //(CSIZE+INVWIDTH-100, 100)
    this.fuelRing = new ItemRing(Fuel, playerInfo.fuelSlotNumb,8, new Vector(this.width/2,
      this.height*(this.basePercent+0.10)), this.offAlpha);
    this.rockRing = new ItemRing(Rock, playerInfo.rockSlotNumb,6, new Vector(this.width/2,
      this.height*(this.basePercent+0.28)), this.offAlpha);
    this.rings = [this.fuelRing, this.rockRing];
    this.addFreeSpots(playerInfo.itemSlotNumb);
    this.selectedRingIndex = 1;
    this.rings[this.selectedRingIndex].selected = true;

    for(var fuelInfo of playerInfo.fuelInfos){
      var fuel = new (eval(fuelInfo.className))(null, new Vector(0,0), fuelInfo.defInfo);
      this.add(fuel);
    }
    for(var rockInfo of playerInfo.rockInfos){
      var rock = new (eval(rockInfo.className))(null, new Vector(0,0), rockInfo.defInfo);
      this.add(rock);
    }
    for(var itemInfo of playerInfo.itemInfos){
      var item = new (eval(itemInfo.className))(null, new Vector(0,0), itemInfo.defInfo);
      this.add(item);
    }
  }
  getInfo(){
    var fuelRingInfo = this.fuelRing.getInfo();
    var rockRingInfo = this.rockRing.getInfo();
    var itemRingInfo = {
      defInfos:[],
      slotNumb:0,
    };
    for(var ring of this.rings){
      if(ring.itemClass === Entity){
        var ringInfo = ring.getInfo();
        itemRingInfo.defInfos.push(...ringInfo.defInfos);
        itemRingInfo.slotNumb += ringInfo.slotNumb;
      }
    }
    return {
      fuelRingInfo:fuelRingInfo,
      rockRingInfo:rockRingInfo,
      itemRingInfo:itemRingInfo,
    };
  }
  update(dt){
    for(var ring of this.rings){
      ring.update(dt);
    }
  }
  addItemSlots(itemClass, amt){
    if(itemClass === Entity){
      this.addFreeSpots(amt);
      return;
    }
    for(var ring of this.rings){
      if(ring.itemClass === itemClass){
        ring.addItemSlots(amt);
        return;
      }
    }
  }
  addFreeSpots(amt){
    for(var i = 0; i < amt; i++){
      var freeSpot = this.freeSpots.shift();
      if(freeSpot)
        this.rings.push(freeSpot);
      else{
        break;
      }
    }
  }
  toggleSelection(change){
    this.rings[this.selectedRingIndex].selected = false;
    if(change<0){
      this.selectedRingIndex++;
      if(this.selectedRingIndex >= this.rings.length){
        this.selectedRingIndex = 0;
      }
    } else if(change>0){
      this.selectedRingIndex--;
      if(this.selectedRingIndex < 0){
        this.selectedRingIndex = this.rings.length-1;
      }
    }
    this.rings[this.selectedRingIndex].selected = true;
  }
  getSelectedItem(){
    return this.rings[this.selectedRingIndex].get();
  }
  add(item){
    for(var ring of this.rings){
      if(ring.add(item)){
        return true;
      }
    }
    return false;
  }
  getShift(){
    return this.width/FSIZE;
  }
  draw(canv){
    canv.fillStyle = this.color;
    canv.fillRect(0, 0, this.width, this.height);
    canv.fillStyle = this.lightcolor;
    canv.fillRect(this.width-1, 0, 3, this.height);
    for(var ring of this.rings){
      ring.draw(canv);
    }
    canv.globalAlpha = this.offAlpha;
    for(var freeSpot of this.freeSpots){
      freeSpot.draw(canv);
    }
    canv.globalAlpha = 1;
    // var buffer = 30;
    // var barSize = 1/3;
    // canv.fillStyle = "#660000";
    // var healthPercent = this.entity.hp/this.entity.maxHp;
    // canv.fillRect(buffer, this.height*(1-barSize*healthPercent)-buffer,
    //   this.width-2*buffer, this.height*barSize*healthPercent);
    //this.drawHealthBar(canv);
    var shift = 0.31;
    this.drawBar(canv, shift, 18, 5, 15,
      this.entity.maxHp/this.entity.maxMaxHp, this.entity.hp/this.entity.maxHp);
    this.drawBar(canv, 1-shift, 18, 5, 15,
      1/2, Fire.totalHealth/Fire.totalMaxHealth);
    this.drawText(canv);
  }
  drawText(canv){
    canv.fillStyle = "#87BBFF";
    canv.font = "26px ArcadeClassic";
    var text = this.entity.inCave.cluster.explorerInfo.name;
    canv.fillText(text, this.width/2-canv.measureText(text).width/2,
      this.height*(this.baseTextPercent+this.namePercent));
    canv.font = "20px ArcadeClassic";
    var text = "level:   " + this.entity.inCave.cluster.explorerInfo.level;
    canv.fillText(text, this.width/2-canv.measureText(text).width/2,
      this.height*(this.baseTextPercent+this.levelPercent));
  }
  drawBar(canv, xPercent, x, y, numb, maxPercent, percent){
    var scale = 2.8;
    var x = x;
    var y = y;
    var maxMaxHp = numb;
    var maxHp = numb * maxPercent;
    var hp = maxHp * percent;
    var width = this.width*xPercent-0.5*x*scale;
    canv.globalAlpha = this.offAlpha;
    for(var i = 0; i<maxMaxHp; i++){
      canv.drawImage(this.bibempty, width,
        this.height*this.healthBarBottomPercent-(y-1)*scale*i, x*scale, y*scale);
    }
    canv.globalAlpha = 1;
    for(var i = 0; i<maxHp; i++){
      canv.drawImage(this.bibempty, width,
        this.height*this.healthBarBottomPercent-(y-1)*scale*i, x*scale, y*scale);
    }
    for(var i = 0; i<hp; i++){
      canv.drawImage(this.bibred, width,
        this.height*this.healthBarBottomPercent-(y-1)*scale*i, x*scale, y*scale);
    }
  }
}

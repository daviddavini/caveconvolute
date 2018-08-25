class Inventory {
  constructor(entity){
    this.entity = entity;
    this.width = INVWIDTH;
    this.height = CSIZE;
    this.color = "#253245";
    this.lightcolor = "#425C7D";
    this.bibfaded = assetManager.getImage("bibfaded");
    this.bibempty = assetManager.getImage("bibempty");
    this.bibred = assetManager.getImage("bibred");
    this.offAlpha = 0.15;
    this.basePercent = 0.01;
    this.healthBarBottomPercent = 0.94;
    this.freeSpots = [new ItemRing(Entity, 1,1, new Vector(this.width*(0.34),this.height*(this.basePercent+0.42)), this.offAlpha),
                      new ItemRing(Entity, 1,1, new Vector(this.width*(0.34),this.height*(this.basePercent+0.48)), this.offAlpha),
                      new ItemRing(Entity, 1,1, new Vector(this.width*(0.34),this.height*(this.basePercent+0.54)), this.offAlpha),
                      new ItemRing(Entity, 1,1, new Vector(this.width*(0.34),this.height*(this.basePercent+0.60)), this.offAlpha),
                      new ItemRing(Entity, 1,1, new Vector(this.width*(0.66),this.height*(this.basePercent+0.42)), this.offAlpha),
                      new ItemRing(Entity, 1,1, new Vector(this.width*(0.66),this.height*(this.basePercent+0.48)), this.offAlpha),
                      new ItemRing(Entity, 1,1, new Vector(this.width*(0.66),this.height*(this.basePercent+0.54)), this.offAlpha),
                      new ItemRing(Entity, 1,1, new Vector(this.width*(0.66),this.height*(this.basePercent+0.60)), this.offAlpha)];
    //(CSIZE+INVWIDTH-100, 100)
    this.rings = [
      new ItemRing(Fuel, 3,8, new Vector(this.width/2, this.height*(this.basePercent+0.10)), this.offAlpha),
      new ItemRing(Rock, 1,6, new Vector(this.width/2, this.height*(this.basePercent+0.28)), this.offAlpha),
    ]
    this.addFreeSpots(3);
    this.selectedRingIndex = 1;
    this.rings[this.selectedRingIndex].selected = true;
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
    this.drawHealthBar(canv);
  }
  drawHealthBar(canv){
    var scale = 2.8;
    var x = 32;
    var y = 6;
    canv.globalAlpha = this.offAlpha;
    for(var i = 0; i<this.entity.maxMaxHp; i++){
      canv.drawImage(this.bibempty, this.width/2-0.5*x*scale,
        this.height*this.healthBarBottomPercent-(y-1)*scale*i, x*scale, y*scale);
    }
    canv.globalAlpha = 1;
    for(var i = 0; i<this.entity.maxHp; i++){
      canv.drawImage(this.bibempty, this.width/2-0.5*x*scale,
        this.height*this.healthBarBottomPercent-(y-1)*scale*i, x*scale, y*scale);
    }
    for(var i = 0; i<this.entity.hp; i++){
      canv.drawImage(this.bibred, this.width/2-0.5*x*scale,
        this.height*this.healthBarBottomPercent-(y-1)*scale*i, x*scale, y*scale);
    }
  }
}

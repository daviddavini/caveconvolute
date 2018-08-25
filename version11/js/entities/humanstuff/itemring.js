class ItemRing {
  constructor(itemClass, max, maxMax, center, offAlpha){
    this.selected = false;
    this.itemClass = itemClass;
    this.center = center;
    this.radius = 40;
    this.singleImageSize = 34;
    this.imageSize = 30;
    this.items = [];
    this.numbOfItems = 0;
    this.maxNumbOfItems = max;
    this.maxMaxNumbOfItems = maxMax;
    this.startAng = 0;
    this.offAlpha = offAlpha;


    if(itemClass === Rock){
      this.imageOutlineFull = assetManager.getImage(["rockoutlinefull"]);
      this.imageOutlineEmpty = assetManager.getImage(["rockoutlineempty"]);
    } else if(itemClass === Fuel){
      this.imageOutlineFull = assetManager.getImage(["fueloutlinefull"]);
      this.imageOutlineEmpty = assetManager.getImage(["fueloutlineempty"]);
    } else if(itemClass === Entity){
      this.imageOutlineFull = assetManager.getImage(["invoutlinefull"]);
      this.imageOutlineEmpty = assetManager.getImage(["invoutlineempty"]);
    } else {
      this.imageOutlineFull = assetManager.getImage(["invoutlinefull"]);
      this.imageOutlineEmpty = assetManager.getImage(["invoutlineempty"]);
    }
  }
  update(dt){
    for(var item of this.items){
      item.image.tick(dt);
    }
  }
  add(item){
    if(item instanceof this.itemClass && this.items.length < this.maxNumbOfItems){
      if(this.itemClass === Entity && (item instanceof Rock || item instanceof Fuel))
        return false;
      this.items.push(item);
      return true;
    }
    return false;
  }
  get(){
    return this.items.pop();
  }
  addItemSlots(amt){
    this.maxNumbOfItems += amt;
    if(this.maxNumbOfItems >= this.maxMaxNumbOfItems){
      this.maxNumbOfItems = this.maxMaxNumbOfItems;
    }
  }
  drawRing(canv){
    canv.beginPath();
    canv.arc(this.center.x, this.center.y, 6, 0, Math.PI*2, true);
    canv.closePath();
    canv.fillStyle = "#0F1521";
    canv.fill();
    // if(this.maxNumbOfItems === 1){
    //   this.startAng = 0;
    // } else if(this.maxNumbOfItems === 2){
    //   this.startAng = 1/4;
    // } else if(this.maxNumbOfItems === 4){
    //   this.startAng = 1/8;
    // } else {
    //   this.startAng = 0;
    // }
    // canv.lineWidth = 3;
    // canv.strokeStyle = "#2C3D60";
    // canv.stroke();


    if(this.selected){
      canv.globalAlpha = this.offAlpha;
      for(var i = 0; i < this.maxMaxNumbOfItems; i++){
        canv.drawImage(this.imageOutlineFull, this.center.x + this.radius*Math.sin(Math.PI*2*(this.startAng+i/this.maxMaxNumbOfItems))-this.imageSize*(18/16)/2,
          this.center.y - this.radius*Math.cos(Math.PI*2*(this.startAng+i/this.maxMaxNumbOfItems)) - this.imageSize*(18/16)/2,
          this.imageSize*18/16, this.imageSize*18/16);
      }
      canv.globalAlpha = 1;
      for(var i = 0; i < this.maxNumbOfItems; i++){
        canv.drawImage(this.imageOutlineFull, this.center.x + this.radius*Math.sin(Math.PI*2*(this.startAng+i/this.maxMaxNumbOfItems))-this.imageSize*(18/16)/2,
          this.center.y - this.radius*Math.cos(Math.PI*2*(this.startAng+i/this.maxMaxNumbOfItems)) - this.imageSize*(18/16)/2,
          this.imageSize*18/16, this.imageSize*18/16);
      }
    } else{
      canv.globalAlpha = this.offAlpha;
      for(var i = 0; i < this.maxMaxNumbOfItems; i++){
        canv.drawImage(this.imageOutlineEmpty, this.center.x + this.radius*Math.sin(Math.PI*2*(this.startAng+i/this.maxMaxNumbOfItems))-this.imageSize*(18/16)/2,
          this.center.y - this.radius*Math.cos(Math.PI*2*(this.startAng+i/this.maxMaxNumbOfItems)) - this.imageSize*(18/16)/2,
          this.imageSize*18/16, this.imageSize*18/16);
      }
      canv.globalAlpha = 1;
      for(var i = 0; i < this.maxNumbOfItems; i++){
        canv.drawImage(this.imageOutlineEmpty, this.center.x + this.radius*Math.sin(Math.PI*2*(this.startAng+i/this.maxMaxNumbOfItems))-this.imageSize*(18/16)/2,
          this.center.y - this.radius*Math.cos(Math.PI*2*(this.startAng+i/this.maxMaxNumbOfItems)) - this.imageSize*(18/16)/2,
          this.imageSize*18/16, this.imageSize*18/16);
      }
    }
    for(var i = 0; i < this.items.length; i++){
      this.items[i].image.drawStraight(canv,
        this.center.x + this.radius*Math.sin(Math.PI*2*(this.startAng+i/this.maxMaxNumbOfItems)),
        this.center.y - this.radius*Math.cos(Math.PI*2*(this.startAng+i/this.maxMaxNumbOfItems)), this.imageSize);
      // canv.drawImage(this.items[i].image.image, this.center.x + this.radius*Math.sin(Math.PI*2*(this.startAng+i/this.maxMaxNumbOfItems))-this.imageSize/2,
      //   this.center.y - this.radius*Math.cos(Math.PI*2*(this.startAng+i/this.maxMaxNumbOfItems)) - this.imageSize/2,
      //   this.imageSize, this.imageSize);
    }
  }
  drawSingle(canv){
    if(this.selected){
      canv.drawImage(this.imageOutlineFull, this.center.x -this.singleImageSize*(18/16)/2,
        this.center.y - this.singleImageSize*(18/16)/2,
        this.singleImageSize*(18/16), this.singleImageSize*(18/16));
    } else{
      canv.drawImage(this.imageOutlineEmpty, this.center.x -this.singleImageSize*(18/16)/2,
        this.center.y - this.singleImageSize*(18/16)/2,
        this.singleImageSize*(18/16), this.singleImageSize*(18/16));
    }
    if(this.items.length){
      this.items[0].image.drawStraight(canv,
        this.center.x, this.center.y, this.singleImageSize);
      // canv.drawImage(this.items[0].image.image, this.center.x -this.singleImageSize/2,
      //   this.center.y - this.singleImageSize/2,
      //   this.singleImageSize, this.singleImageSize);
    }
  }
  draw(canv){
    if (this.maxNumbOfItems === 1 && this.itemClass === Entity){
      this.drawSingle(canv);
    } else{
      this.drawRing(canv);
    }
  }
}

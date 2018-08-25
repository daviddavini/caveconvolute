class Holder extends Entity{
  constructor(inCave, pos, itemClass){
    super(inCave, pos);
    this.weight = 1;
    this.level = 1;

    this.size.set(new Vector(0.6, 0.6));
    this.drawPosChange.set(new Vector(-0.1, -0.1));
    this.drawSize.set(new Vector(0.8, 0.8));
    this.numbItemSpots = 1;
    this.itemClass = itemClass ? itemClass : [Entity, Fuel, Rock][randInt(0,3)];
    if(this.itemClass === Rock){
      this.value = (3);
      this.image = new Sprite(assetManager.getImage(["rockoutlinefull"]), this.drawPosChange, this.drawSize);
    } else if(this.itemClass === Fuel){
      this.value = (2);
      this.image = new Sprite(assetManager.getImage(["fueloutlinefull"]), this.drawPosChange, this.drawSize);
    } else if(this.itemClass === Entity){
      this.value = (3);
      this.image = new Sprite(assetManager.getImage(["invoutlinefull"]), this.drawPosChange, this.drawSize);
    }
    this.maxHp = 1;
    this.hp = this.maxHp;
    this.makeShadow();
  }
  sameAs(entity){
    if(super.sameAs(entity)){
      return this.itemClass === entity.itemClass;
    }
    return false;
  }
  addToCave(inCave){
    super.addToCave(inCave);
    this.inCave.entities.addToCategory(this, "holders");
    this.inCave.entities.addToCategory(this, "items");
    this.inCave.entities.addToCategory(this, "collidables");
    this.inCave.entities.addToCategory(this, "grounds");
  }
  useOnCollect(entity){
    entity.addItemSlots(this.itemClass, this.numbItemSpots);
    return true;
  }
}
Holder.prototype.collisionHandles = {};
Holder.prototype.stateHandleStarts = {};
Holder.prototype.stateHandleFinishes = {};
Holder.value = 3;

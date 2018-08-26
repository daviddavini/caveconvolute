class Coin extends Entity{
  constructor(inCave, pos, defInfo){
    super(inCave, pos);
    this.weight = 1;
    this.flyDamage = 0;
    this.level = defInfo.level;
    this.value = 1;

    this.healthBump = 1;
    this.maxHp = 1;
    this.hp = this.maxHp;
    if(this.level === 1){
      this.image = new Sprite(assetManager.getImage(["coinbronze"]), this.drawPosChange, this.drawSize, 8, 8);
    } else if(this.level === 2){
      this.image = new Sprite(assetManager.getImage(["coinsilver"]), this.drawPosChange, this.drawSize, 8, 8);
    } else if(this.level === 3){
      this.image = new Sprite(assetManager.getImage(["coingold"]), this.drawPosChange, this.drawSize, 8, 8);
    }
    this.size.set(new Vector(0.5, 0.5));
    this.drawSize.set(new Vector(0.6, 0.6));
    this.drawPosChange.set(this.size.minus(this.drawSize).times(1/2));
  }
  getInfo(){
    return {
      level: this.level,
    };
  }
  sameAs(entity){
    if(super.sameAs(entity)){
      return this.level === entity.level;
    }
    return false;
  }
  addToCave(inCave){
    super.addToCave(inCave);
    this.inCave.entities.addToCategory(this, "coins");
    this.inCave.entities.addToCategory(this, "items");
    this.inCave.entities.addToCategory(this, "collidables");
    this.inCave.entities.addToCategory(this, "grounds");
  }
}
Coin.prototype.collisionHandles = {
};
Coin.prototype.stateHandleStarts = {};
Coin.prototype.stateHandleFinishes = {};
Coin.value = 1;

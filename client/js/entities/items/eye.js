class Eye extends Entity{
  constructor(inCave, pos, defInfo){
    super(inCave, pos);
    this.weight = 1;
    this.level = 1;
    this.value = (1/2);

    this.size.set(new Vector(0.6, 0.6));
    this.drawSize.set(new Vector(0.6, 0.6));
    this.drawPosChange.set(this.size.minus(this.drawSize).times(0.5));
    this.healthBump = 1;
    this.maxHp = 1;
    this.hp = this.maxHp;
    this.image = new Sprite(assetManager.getImage(["larvae"]), this.drawPosChange, this.drawSize, 7, 5);
    this.makeShadow();
  }
  getInfo(){
    return {

    };
  }
  addToCave(inCave){
    super.addToCave(inCave);
    this.inCave.entities.addToCategory(this, "eyes");
    this.inCave.entities.addToCategory(this, "items");
    this.inCave.entities.addToCategory(this, "collidables");
    this.inCave.entities.addToCategory(this, "grounds");
  }
}
Eye.prototype.collisionHandles = {
};
Eye.prototype.stateHandleStarts = {};
Eye.prototype.stateHandleFinishes = {};
Eye.value = 1/1.5;

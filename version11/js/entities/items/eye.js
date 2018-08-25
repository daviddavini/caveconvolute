class Eye extends Entity{
  constructor(inCave, pos){
    super(inCave, pos);
    this.weight = 1;
    this.level = 1;
    this.value = (1/2);

    this.size.set(new Vector(0.45, 0.45));
    this.drawPosChange.set(new Vector(-0.075, -0.075));
    this.drawSize.set(new Vector(0.6, 0.6));
    this.healthBump = 1;
    this.maxHp = 1;
    this.hp = this.maxHp;
    this.image = new Sprite(assetManager.getImage(["wing"]), this.drawPosChange, this.drawSize);
    this.makeShadow();
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
Eye.value = 1/2;

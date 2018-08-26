class Wing extends Entity{
  constructor(inCave, pos, defInfo){
    super(inCave, pos);
    this.weight = 1;
    this.level = 1;
    this.value = (1);

    this.flyDamage = 1/2;
    this.size.set(new Vector(0.9, 0.9));
    this.drawPosChange.set(new Vector(-0.1, -0.1));
    this.drawSize.set(new Vector(1.1, 1.1));
    this.healthBump = 1;
    this.maxHp = 1;
    this.hp = this.maxHp;
    this.image = new Sprite(assetManager.getImage(["wing"]), this.drawPosChange, this.drawSize);
    this.makeShadow();
  }
  getInfo(){
    return {

    };
  }
  addToCave(inCave){
    super.addToCave(inCave);
    this.inCave.entities.addToCategory(this, "wings");
    this.inCave.entities.addToCategory(this, "items");
    this.inCave.entities.addToCategory(this, "collidables");
    this.inCave.entities.addToCategory(this, "grounds");
  }
}
Wing.prototype.collisionHandles = {
};
Wing.prototype.stateHandleStarts = {};
Wing.prototype.stateHandleFinishes = {};
Wing.value = 1;

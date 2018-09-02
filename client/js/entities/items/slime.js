class Slime extends Entity{
  constructor(inCave, pos, defInfo){
    super(inCave, pos);
    this.weight = 1;
    this.flyDamage = 1/2;
    this.level = 1;

    this.size.set(new Vector(0.6, 0.6));
    this.drawPosChange.set(new Vector(-0.1, -0.1));
    this.drawSize.set(new Vector(0.8, 0.8));
    this.healthBump = 1;
    this.maxHp = 1;
    this.hp = this.maxHp;
    this.image = new Sprite(assetManager.getImage(["slime"]), this.drawPosChange, this.drawSize, 3, 4);
    this.makeShadow();
  }
  getInfo(){
    return {

    };
  }
  addToCave(inCave){
    super.addToCave(inCave);
    this.inCave.entities.addToCategory(this, "slimes");
    this.inCave.entities.addToCategory(this, "items");
    this.inCave.entities.addToCategory(this, "collidables");
    this.inCave.entities.addToCategory(this, "grounds");
  }
  draw(canv, shiftX, shiftY){
    canv.globalAlpha *= 0.5;
    super.draw(canv, shiftX, shiftY);
    canv.globalAlpha /= 0.5;
  }
}
Slime.prototype.collisionHandles = {
};
Slime.prototype.stateHandleStarts = {};
Slime.prototype.stateHandleFinishes = {};
Slime.value = 1/3;

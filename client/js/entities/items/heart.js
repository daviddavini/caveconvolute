class Heart extends Entity{
  constructor(inCave, pos, defInfo){
    super(inCave, pos);
    this.weight = 1;
    this.level = 1;
    this.value = 2;

    this.size.set(new Vector(0.7, 0.7));
    this.drawPosChange.set(new Vector(-0.1, -0.1));
    this.drawSize.set(new Vector(0.9, 0.9));
    this.healthBump = 1;
    this.maxHp = 1;
    this.hp = this.maxHp;
    this.image = new Sprite(assetManager.getImage(["heart"]), this.drawPosChange, this.drawSize, 6, 5);

    this.shadowSize = new Vector(this.size.x, this.size.x*7/16);
    this.shadowPosChange = new Vector((this.size.x-this.shadowSize.x)/2, (this.size.y-this.shadowSize.y/2));
    this.shadowImage = new Sprite(assetManager.getImage("shadow"), this.shadowPosChange, this.shadowSize);
    this.makeShadow();
  }
  getInfo(){
    return {

    };
  }
  addToCave(inCave){
    super.addToCave(inCave);
    this.inCave.entities.addToCategory(this, "hearts");
    this.inCave.entities.addToCategory(this, "items");
    this.inCave.entities.addToCategory(this, "collidables");
    this.inCave.entities.addToCategory(this, "grounds");
  }
  useOnCollect(entity){
    entity.gainMaxHp(this.healthBump);
    //entity.gainHp(999999);
    return true;
  }
}
Heart.prototype.collisionHandles = {};
Heart.prototype.stateHandleStarts = {};
Heart.prototype.stateHandleFinishes = {};
Heart.value = 2;

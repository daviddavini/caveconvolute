class Bear extends Entity{
  constructor(inCave, pos, defInfo){
    super(inCave, pos);
    this.maxHp = 1;
    this.hp = this.maxHp;
    this.spd = 15;
    this.size.set(new Vector(3,3));
    this.image = new Sprite(assetManager.getImage("bear"), new Vector(0,0), this.size.copy())
    this.defaultMoveStyle = new IdleMove(this);
    this.setMoveStyle(this.defaultMoveStyle);

    this.shadowSize = new Vector(this.size.x, this.size.x*7/16);
    this.shadowPosChange = new Vector((this.size.x-this.shadowSize.x)/2, (this.size.y-this.shadowSize.y/2));
    this.shadowImage = new Sprite(assetManager.getImage("shadow"), this.shadowPosChange, this.shadowSize);
  }
  addToCave(inCave){
    super.addToCave(inCave);
    this.inCave.entities.addToCategory(this, "bears");
    this.inCave.entities.addToCategory(this, "damagables");
    this.inCave.entities.addToCategory(this, "collidables");
    this.inCave.entities.addToCategory(this, "grounds");
  }
}
Bear.prototype.collisionHandles = {};
Bear.prototype.stateHandleStarts = {};
Bear.prototype.stateHandleFinishes = {};

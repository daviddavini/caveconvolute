class Flower extends Entity{
  constructor(inCave, pos, groupId){
    super(inCave, pos);
    this.groupId = groupId ? groupId : Math.random();
    var flowerList = assetManager.getImagePack(["flowers"]);
    this.flowerColorNumber = Math.floor(flowerList.length*this.groupId);
    var flowerImage = flowerList[this.flowerColorNumber];
    this.weight = 1;
    this.level = 1;
    this.value = (1/2); //because you have to find right type

    this.pos.add(new Vector(0.2, 0.2));
    this.size.set(new Vector(0.6, 0.6));
    this.drawPosChange.set(new Vector(-0.1,-0.1));
    this.drawSize.set(new Vector(0.8,0.8));
    this.images = {healthy: new Sprite(flowerImage, this.drawPosChange, this.drawSize),
              flat: new Sprite(assetManager.getImage("flowerflat"), this.drawPosChange, this.drawSize)};
    this.image = this.images.healthy;
    new State("flat", this);
  }
  sameAs(entity){
    if(super.sameAs(entity)){
      if(this.flowerColorNumber === entity.flowerColorNumber){
        return true;
      }
    }
    return false;
  }
  addToCave(inCave){
    super.addToCave(inCave);
    this.inCave.entities.addToCategory(this, "flowers");
    this.inCave.entities.addToCategory(this, "collidables");
    this.inCave.entities.addToCategory(this, "items");
    this.inCave.entities.addToCategory(this, "grounds");
  }
}
Flower.prototype.collisionHandles = {
  players: function(overlapFixVec, entity, newCollision){
    if(Math.random()<0.5 && newCollision && this.moveStyle instanceof IdleMove)
    this.states.flat.start();
  }
};
Flower.prototype.stateHandleStarts = {
  flat: function(){
    this.image = this.images.flat;
    this.inCave.entities.removeFromCategory(this, "items");
  }
};
Flower.prototype.stateHandleFinishes = {
  flat: function(){
    this.image = this.images.healthy;
    this.inCave.entities.addToCategory(this, "items");
  }
};
Flower.value = 1/2; //bc of different colors

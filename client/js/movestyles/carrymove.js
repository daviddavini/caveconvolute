class CarryMove extends MoveStyle{
  constructor(entity, carrier, carryPosChange, carryDir, buzzSize){
    super(entity);
    this.carrier = carrier;
    carryPosChange = carryPosChange ? carryPosChange : new Vector(0,0);
    this.carryPosChange = this.carrier.size.times(0.5).minus(this.entity.size.times(0.5)).plus(carryPosChange);
    this.carryDir = carryDir ? carryDir : new Vector(0,0);
    this.buzzSize = buzzSize ? buzzSize : 0;
    this.straightEntityPos = new Vector(0,0);
    this.update(0);
  }
  getPosChange(){
    return this.carryPosChange.plus(new Vector(0.25*this.carryDir.x, 0.1*this.carryDir.y));
  }
  updateStraightEntityPos(){
    this.straightEntityPos.set(this.carrier.pos.plus(this.getPosChange()));
  }
  update(dt){
    this.updateStraightEntityPos();
    this.entity.pos.set(this.straightEntityPos.plus(Vector.randUnit().times(this.buzzSize)));
  }
}

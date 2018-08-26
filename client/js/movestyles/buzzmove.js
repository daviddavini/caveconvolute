class BuzzMove extends PhysicsMove{
  constructor(entity, buzzSize){
    super(entity);
    this.entity = entity;
    this.buzzSize = buzzSize;
  }
  update(dt){
    this.entity.vel.set(Vector.randUnit().times(this.buzzSize));
    super.update(dt);
  }
}

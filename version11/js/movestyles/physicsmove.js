class PhysicsMove extends MoveStyle{
  constructor(entity){
    super(entity);
  }
  update(dt){
    this.entity.posChange = this.entity.vel.times(dt);
    this.entity.pos.add(this.entity.posChange);
  }
}

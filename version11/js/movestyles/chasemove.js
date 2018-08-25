class ChaseMove extends PhysicsMove{
  constructor(entity, huntedCaveGroup, seeDist, redirectTime, redirectTimeRange, shakeSize, isRunAway){
    super(entity);
    this.isRunAway = isRunAway;
    this.seeDist = seeDist;
    this.redirectTime = redirectTime;
    this.redirectTimeRange = redirectTimeRange;
    this.redirectCount = 0;
    this.shakeSize = shakeSize;
    this.huntedEntity = null;
    this.huntPos = new Vector(0,0);
    this.huntDir = new Vector(1,0);
    var closestDist = seeDist;
    for(var huntEntity of this.entity.inCave.entities.get(huntedCaveGroup)){
      var dist = this.entity.pos.dist(huntEntity.pos);
      if(dist < closestDist){
        console.log("yes");
        this.huntedEntity = huntEntity;
        closestDist = dist;
      }
    }
    if(this.huntedEntity){
      this.huntPos.set(this.huntedEntity.pos.copy());
      this.huntDir.set(this.huntPos.minus(this.entity.pos).getUnit());
    }
  }
  update(dt){
    if(!this.huntedEntity){
      this.entity.setMoveStyle(this.entity.defaultMoveStyle);
      return;
    }
    this.redirectCount -= dt;
    if(this.redirectCount <= 0){
      this.redirectCount = this.redirectTime + Math.random()*this.redirectTimeRange;
      this.huntPos.set(this.huntedEntity.pos.copy());
      if(this.entity.pos.dist(this.huntPos) < this.seeDist){
        this.huntDir.set(this.huntPos.minus(this.entity.pos).getUnit());
      } else{
        this.entity.setMoveStyle(this.entity.defaultMoveStyle);
        return;
      }
    }
    if(this.isRunAway){
      this.entity.vel.set(this.huntDir.times(-1).plus(Vector.randUnit().times(this.shakeSize)).times(this.entity.spd));
    }else{
      this.entity.vel.set(this.huntDir.plus(Vector.randUnit().times(this.shakeSize)).times(this.entity.spd));
    }
    super.update(dt);
  }
}

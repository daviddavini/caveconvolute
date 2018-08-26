class FlyMove extends PhysicsMove{
  constructor(entity, thrower, throwSpd, throwDir, groundHeight, aimPos){
    super(entity);
    this.entity.thrower = thrower;
    this.entity.inCave.entities.removeFromCategory(this.entity,"grounds");
    this.gravity = 13;
    throwSpd /= this.entity.weight;
    if(aimPos){
      var dist = this.entity.pos.dist(aimPos);
      var tanOfAngle = Math.min((this.gravity*dist)/(2*throwSpd*throwSpd), 2);
    }else{
      var tanOfAngle = this.entity.throwUpAngleTan;
    }
    var upwardSpd = throwSpd*tanOfAngle;
    var throwVel = throwDir.times(throwSpd);
    this.groundSpeed = throwVel.y;
    this.groundHeight = groundHeight;
    this.gravityVec = new Vector(0, this.gravity);
    var errorSize = 0.5;
    this.entity.vel.set(throwVel.plus(Vector.randUnit().mult(errorSize)))
                    .add(new Vector(0, -upwardSpd));
  }
  update(dt){
    this.entity.vel.add(this.gravityVec.times(dt));
    super.update(dt);
    this.groundHeight += this.groundSpeed*dt;
    if(this.entity.pos.y > this.groundHeight){
      this.finishFlight();
    }
  }
  flipFlop(connectorShift){
    this.groundHeight -= connectorShift.y;
  }
  finishFlight(){
    this.entity.thrower = null;
    this.entity.vel.set(new Vector(0,0));
    this.entity.setMoveStyle(this.entity.defaultMoveStyle);
    this.entity.inCave.entities.addToCategory(this.entity,"grounds");
  }
  distance(throwSpd, throwUpAngleTan, gravity){
    return 2*throwSpd*throwSpd*throwUpAngleTan / gravity;
  }
}
FlyMove.gravity = 13;

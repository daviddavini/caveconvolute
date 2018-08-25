class PathMove extends PhysicsMove{
  constructor(entity, centralPath){
    super(entity);
    this.entity = entity;
    this.centralPath = centralPath;
    this.status = "offPathTo";  // "offPathTo"  "offPathFrom"  "onPathTo"
    this.pathIndex = this.getClosestPointIndex(this.centralPath);
    this.direction = -1;
    this.entity.pos.plus(this.entity.size.times(0.5)).set(this.centralPath[this.pathIndex]);
  }
  getClosestPointIndex(path){
    var leastDist = 100000000;
    var leastDistIndex = null;
    for(var i = 0 ; i < path.length; i++){
      var dist = this.entity.pos.dist(path[i]);
      if(dist < leastDist){
        leastDist = dist;
        leastDistIndex = i;
      }
    }
    return leastDistIndex;
  }
  setIndexNext(path){
    if(this.pathIndex === path.length-1 && this.direction === 1){
      this.direction = -1;
    } else if(this.pathIndex === 0 && this.direction === -1){
      this.direction = 1;
    }
    this.pathIndex += this.direction;
  }
  reverse(){
    this.direction *= -1;
  }
  update(dt){
    var dispVec = this.centralPath[this.pathIndex].minus(this.entity.pos.plus(this.entity.size.times(0.5)));
    if(dispVec.length() <= 1){
      this.setIndexNext(this.centralPath);
      dispVec = this.centralPath[this.pathIndex].minus(this.entity.pos.plus(this.entity.size.times(0.5)));
    }
    this.entity.dir.set(dispVec.normalize());
    this.entity.vel.set(this.entity.dir.times(this.entity.spd));
    super.update(dt);
  }
}

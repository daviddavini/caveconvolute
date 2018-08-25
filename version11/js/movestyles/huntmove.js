class HuntMove extends PhysicsMove{
  constructor(entity, huntedCaveGroup, reChooseEntityTime, reChooseTimeRange, shakeSize, seeDist){
    super(entity);
    this.huntedCaveGroup = huntedCaveGroup;
    this.huntedEntity = null;
    this.huntPath = null;
    this.huntPos = null;
    this.huntDir = new Vector(0,0);
    this.seeDist = seeDist;
    this.reChooseEntityTime = reChooseEntityTime;
    this.reChooseTimeRange = reChooseTimeRange;
    this.shakeSize = shakeSize;
    this.counter = this.reChooseEntityTime;
  }
  update(dt){
    this.counter -= dt;
    if(this.counter <= 0){
      this.counter = this.reChooseEntityTime + Math.random()*this.reChooseTimeRange;
      this.huntedEntity = null;
      this.huntPos = null;
      var closestDist = this.seeDist;
      for(var id in this.entity.inCave[this.huntedCaveGroup]){
        var dist = this.entity.pos.dist(this.entity.inCave[this.huntedCaveGroup][id].pos);
        if(dist < closestDist){
          this.huntedEntity = this.entity.inCave[this.huntedCaveGroup][id];
          closestDist = dist;
        }
      }
      if(this.huntedEntity){
        this.huntPos = this.huntedEntity.pos.copy();
        this.huntDir.set(this.huntPos.minus(this.entity.pos).getUnit());
      }
    }
    if(this.huntedEntity){
      this.entity.vel.set(this.huntDir.plus(Vector.randUnit().times(this.shakeSize)).times(this.entity.spd));
    } else{
      this.entity.vel.set(Vector.randUnit().times(this.entity.spd));
    }
    super.update(dt);
  }
  notWorkingupdate(dt){
    this.counter += dt;
    if(this.counter > this.recreatePathTime){
      this.huntedEntity = null;
      var closestDist = 100000;
      for(var id in this.huntedCaveEntities){
        var dist = this.entity.pos.dist(this.huntedCaveEntities[id].pos);
        if(dist < closestDist){
          this.huntedEntity = this.huntedCaveEntities[id];
          closestDist = dist;
        }
      }
      if(this.huntedEntity){
        this.huntPath = this.pathfinding(this.entity.pos.floored(), this.huntedEntity.pos.floored(), this.caveMapFloor);
        this.currentHuntPos = this.huntPath.pop();
      } else{
        this.huntPath = null;
        this.currentHuntPos = null;
      }
    }
    if(this.huntedEntity){
      console.log(this.currentHuntPos);
      console.log(this.huntedEntity.pos);
      this.entity.vel.set(this.currentHuntPos.minus(this.entity.pos).getUnit().times(this.entity.spd));
      this.entity.pos.add(this.entity.vel.times(dt));
    }
  }

  neighborsAround(node){
    var neighbors = []
    for(var i = -1; i < 2; i++){
      for(var j = -1; j < 2; j++){
        if(i !== 0 || j !== 0)
          neighbors.push({x:node.x+i, y:node.y+j, gCostChange:Math.abs(i)+Math.abs(j)});
      }
    }
    return neighbors;
  }
  pathfinding(startVec, endVec, array){
    var open = []; //sorted by F cost, high to low
    var closed = [];
    open.push({x:startVec.x, y:startVec.y, fCost:0, gCost:0});
    var current = null;
    var tries = 0;
    while(tries++ < 100){
      current = open.pop();
      closed.push(current);

      if(current.x === endVec.x && current.y === endVec.y){
        break;
      }

      for(var neighbor of this.neighborsAround(current)){
        if(!array[neighbor.x][neighbor.y]){
          continue;
        }
        var inClosed = false;
        for(var closedNode in closed){
          if(closedNode.x === neighbor.x && closedNode.y === neighbor.y){
            inClosed = true;
            break;
          }
        }
        if(inClosed){
          continue;
        }

        neighbor.gCost = current.gCost+neighbor.gCostChange;
        var inOpen = false;
        for(var i = 0; i < open.length; i++){
          if(open[i].x === neighbor.x && open[i].y === neighbor.y){
            inOpen = true;
            if(open[i].gCost > neighbor.gCost){
              open[i].gCost = neighbor.gCost;
              open[i].fCost = open[i].gCost + open[i].hCost;
              open[i].parent = current;
            }
            break;
          }
        }
        if(!inOpen){
          neighbor.hCost = Math.abs(endVec.x-neighbor.x)+Math.abs(endVec.y-neighbor.y);
          neighbor.fCost = neighbor.gCost + neighbor.hCost;
          neighbor.parent = current;
          open.push(neighbor);
          open.sort(function(a,b){return b.fCost-a.fCost});
        }
      }
    }
    var path = [];
    while(current.parent){
      path.push(new Vector(current.x, current.y));
      current = current.parent;
    }
    path.push(new Vector(current.x, current.y));
    return path;
  }
}

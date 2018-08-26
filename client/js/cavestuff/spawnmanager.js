class SpawnWatcher{
  constructor(info){
    this.className = info.className;
    this.groupNumbRange = info.groupNumbRange !== undefined ? info.groupNumbRange : [1,1];
    this.caves = [];
    this.amounts = [];
    this.count = 0;
    this.spawnRate = info.spawnRate  !== undefined ? info.spawnRate : 1/60;
    this.numb = info.numb  !== undefined ? info.numb : 1;
    this.maxNumb = info.maxNumb !== undefined ? info.maxNumb : this.numb;
    this.startNumb = info.startNumb !== undefined ? info.startNumb : this.numb;
    this.print = info.print;
    this.defInfo = info.defInfo;
  }
  update(dt){
    //relies on dt's that are significantly smaller than spawn rates's inverse
    if(this.count < this.numb*this.caves.length && Math.random() < this.spawnRate*dt){
      this.spawn(this.numb);
    }
  }
  addedEntities(cave, entities){
    this.count += entities.length;
    this.amounts[this.caves.indexOf(cave)] += entities.length;
    //console.log("added", entities, this.count);
  }
  removedEntities(cave, entities){
    this.count -= entities.length;
    this.amounts[this.caves.indexOf(cave)] -= entities.length;
    //console.log("removed", entities, this.count);
  }
  addCave(cave){
    this.caves.push(cave);
    this.amounts.push(0);
  }
  spawnEntity(){
    var index = randomIndexWeighted(this.amounts, function(i){return 1/(i+1)});
    var cave = this.caves[index];
    cave.spawnEntity(this.className, this.defInfo);
  }
  spawnEntityGroup(groupNumb){
    var index = randomIndexWeighted(this.amounts, function(i){return 1/(i+1)});
    var cave = this.caves[index];
    cave.spawnEntityGroup(this.className, this.defInfo, groupNumb);
  }
  spawn(numbLimit){
    var groupNumb = randInt(this.groupNumbRange[0], this.groupNumbRange[1]);
    groupNumb = Math.min(numbLimit-this.count, groupNumb);
    if(groupNumb > 1){
      this.spawnEntityGroup(groupNumb);
    }else {
      this.spawnEntity();
    }
  }
  spawnStartEntities(){
    while(this.count < this.startNumb*this.caves.length){
      this.spawn(this.startNumb);
    }
  }
};

class SpawnManager {
  constructor(watchers){
    this.watchers = watchers;
    this.updateCount = 0;
    this.updateTime = 5;
  }
  addCave(cave){
    for(var watcher of this.watchers){
      watcher.addCave(cave);
    }
  }
  spawnStartEntities(){
    for(var watcher of this.watchers){
      if(watcher.caves.length > 0)
        watcher.spawnStartEntities();
    }
  }
  addedEntities(cave, entities){
    for(var watcher of this.watchers){
      if(entities[0] instanceof watcher.className)
        watcher.addedEntities(cave, entities);
    }
  }
  removedEntities(cave, entities){
    for(var watcher of this.watchers){
      if(entities[0] instanceof watcher.className)
        watcher.removedEntities(cave, entities);
    }
  }
  update(dt){
    this.updateCount += dt;
    if(this.updateCount >= this.updateTime){
      for(var watcher of this.watchers){
        if(watcher.caves.length > 0)
          watcher.update(this.updateCount);
      }
      this.updateCount = 0;
    }
  }
}

class LootManager {
  constructor(lootSpawns){
    this.lootSpawns = lootSpawns;
    this.caves = [];
  }
  lootSpawn(cave, dyingEntity){
    console.log("it is happening");
    for(var lootSpawn of this.lootSpawns){
      var qualified = false;
      var chanceMult = 1;
      for(var dying of lootSpawn.dyings){
        if(dyingEntity instanceof dying.className){
          qualified = true;
          chanceMult = dying.chanceMult ? dying.chanceMult : 1;
          break;
        }
      }
      if(qualified){
        for(var born of lootSpawn.borns){
          if(Math.random() < chanceMult*born.chance){
            cave.spawnEntity(born.className, dyingEntity.box.randomInsidePos(), born.definingParam);
          }
        }
      }
    }
  }
  addCave(cave){
    this.caves.push(cave);
  }
}

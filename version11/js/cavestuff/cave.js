class Cave {
  constructor(game, type, cluster){
    this.type = type;
    this.cluster = cluster;
    this.id = Math.random();
    this.number = Cave.number;
    this.difficulty = 1;
    Cave.number++;
    this.game = game;
    this.game.caves[this.id] = this;
    this.entities = new Categorized();
    this.type = type;

    this.spawnManagers = [];
    this.lootManager = null;

    if(type === "home"){
      var groundImages = assetManager.getImagePack("brownground");
      this.caveMap = new RoomMap(this, groundImages, 1, 9, Math.PI*(5/4)+(Math.PI*(1/2))*Math.random());
      this.spawnEntity(Fire, this.caveMap.getCenter());
      this.spawnEntity(Rock);
    } else if (type === "strand"){
      this.caveMap = new StrandMap(this, 8, 2);
      for(var pos = this.useLandmarkArea().pos; pos; pos = this.useLandmarkArea().pos){
        this.createLandmarkArea(pos);
      }
    } else if (type === "quarry"){
      var groundImages = assetManager.getImagePack("quarryground");
      this.caveMap = new RoomMap(this, groundImages, 1, 7);
    } else if (type === "oasis"){
      var groundImages = assetManager.getImagePack("greenground");
      this.caveMap = new RoomMap(this, groundImages, 1, 10);
      this.spawnEntity(Pond, this.caveMap.getCenter());
    } else if (type === "dungeon"){
      var groundImages = assetManager.getImagePack("darkground");
      this.caveMap = new RoomMap(this, groundImages, 1, 12);
      this.spawnEntity(Gem, this.caveMap.getCenter());
    } else if (type === "traderoom"){
      var groundImages = assetManager.getImagePack("blueground");
      this.caveMap = new RoomMap(this, groundImages, 1, 13, Math.PI*2*Math.random(), 1);
      var traderPoss = this.caveMap.circlePoss(4);
      for(var i = 0; i < 2; i++){
        this.spawnEntity(Man, traderPoss[i],
          {type:"trader", valueRange:this.cluster.levelInfo.traderValueRange, way:"give"});
      }
      for(var i = 2; i < 4; i++){
        this.spawnEntity(Man, traderPoss[i],
          {type:"trader", valueRange:this.cluster.levelInfo.traderValueRange, way:"receive"});
      }
    } else if (type === "exit"){
      var groundImages = assetManager.getImagePack("darkground");
      this.caveMap = new RectMap(this, groundImages, [], ["down"], 15, 25);
      var gate = this.spawnEntity(Gate, this.caveMap.getGateSpot());
      var poss = this.caveMap.getBankerSpots();
      var defInfos = [{type:"banker", exlevel:2, exdir:"down"}, {type:"banker", exlevel:1, exdir:"down"},
                      {type:"banker", exlevel:2, exdir:"up"}, {type:"banker", exlevel:1, exdir:"up"}];
      for(var i = 0; i < poss.length; i++){
        this.spawnEntity(Man, poss[i], defInfos[i]);
      }
      this.spawnEntity(Man, this.caveMap.getManSpot(),
        {type:"keeper", gate:gate, valueRange:this.cluster.levelInfo.keeperValueRange});
    } else if (type === "link"){
      var groundImages = assetManager.getImagePack("darkground");
      this.caveMap = new RectMap(this, groundImages, ["down"], [], 5, 41);
    } else if (type === "startlink"){
      var groundImages = assetManager.getImagePack("darkground");
      this.caveMap = new RectMap(this, groundImages, ["up"], [], 5, 41);
    }
  }
  finishLevel(){
  }
  useLandmarkArea(){
    var keyArea = this.caveMap.useRandomKeyArea();
    if(!keyArea)
      return false;
    return keyArea;
  }
  createLandmarkArea(pos){
    console.log(pos);
    if(Cave.numbLandmarkAreas === 0){
      this.spawnEntity(Fountain, pos.copy());
    } else if(Cave.numbLandmarkAreas === 1){
      for(var i = 0; i < randInt(8,12); i++){
        this.spawnEntity(Grave, pos.plus(Vector.random(Math.random()*5+1)));
      }
      // if(keyArea.poss.length){
      //   for(var i = 0; i < randInt(8,12); i++){
      //     this.spawnEntity(Grave, keyArea.poss[randInt(0,keyArea.poss.length)].plus(Vector.random(Math.random()*3+2)));
      //   }
      // }
    } else if(Cave.numbLandmarkAreas === 2){
      for(var i = 0; i < randInt(8,12); i++){
        this.spawnEntity(Barrel, pos.plus(Vector.random(Math.random()*5+1)));
      }
    } else if(Cave.numbLandmarkAreas === 3){
      this.spawnEntity(Column, pos.copy());
    } else if(Cave.numbLandmarkAreas === 4){
      this.spawnEntity(BoneStick, pos.copy());
    } else if(Cave.numbLandmarkAreas === 5){
      this.spawnEntity(Bear, pos.copy());
    } else if(Cave.numbLandmarkAreas === 6){
      for(var i = 0; i < randInt(12,16); i++){
        this.spawnEntity(Mushroom, pos.plus(Vector.random(Math.random()*5+1)));
      }
    } else{
      console.log("AAAHHH");
      return false;
    }
    Cave.numbLandmarkAreas++;
    return true;
  }
  lootSpawn(dyingEntity){
    this.lootManager.lootSpawn(this, dyingEntity);
  }
  setLootManager(lootManager){
    this.lootManager = lootManager;
  }
  addSpawnManager(spawnManager){
    this.spawnManagers.push(spawnManager);
  }
  spawnEntity(entityClass, pos, definingParam){
    var entity = null;
    if(pos)
      entity = new entityClass(this, pos, definingParam);
    else
      entity = new entityClass(this, this.caveMap.randomPos(), definingParam);
    return entity;
  }
  spawnEntityGroup(entityClass, numb){
    var entityPosGroup = this.caveMap.randomPosGroup(numb, Math.sqrt(numb)*3);
    var groupId = Math.random();
    var entities = [];
    for(var entityPos of entityPosGroup){
      entities.push(new entityClass(this, entityPos.add(Vector.randUnit().times(0.3)), groupId));
    }
  }
  addedEntity(entity){
    for(var spawnManager of this.spawnManagers){
      spawnManager.addedEntities(this, [entity]);
    }
  }
  removedEntity(entity){
    for(var spawnManager of this.spawnManagers){
      spawnManager.removedEntities(this, [entity]);
    }
  }
  update(dt){
    //console.log(this.entities);
    for(var fire of this.entities.get("fires")){
      fire.tick(dt);
    }
    var updateEntities = this.entities.get("players").length;
    for(var id in this.caveMap.connectors){
      if(this.caveMap.connectors[id].isConnected && this.caveMap.connectors[id].connectedCave.entities.get("players").length){
        updateEntities = true;
        break;
      }
    }
    if(updateEntities){
      for(var entity of this.entities.get("updatables")) {
        entity.update(dt);
      }
      for(var entity of this.entities.get("collidables")){
        entity.handleCollisions(this.entities);
      }
      this.caveMap.update(dt);
    }
  }
  drawBack(canv, shiftX, shiftY, playerPos){
    this.caveMap.draw(canv, shiftX, shiftY, playerPos);
  }
  drawEntities(canv, shiftX, shiftY, entities){
    entities.sort(function(a,b){b.pos.y-a.pos.y});
    for(var entity of entities) {
      entity.draw(canv, shiftX, shiftY);
    }
  }
  drawFront(canv, shiftX, shiftY, playerPos){
    for(var entity of this.entities.get("draw1")) {
      if(playerPos.dist(entity.pos) < 1.5*NOWWINDOWSIZE)
        entity.draw(canv, shiftX, shiftY, playerPos);
    }
    for(var entity of this.entities.get("draw2")) {
      if(playerPos.dist(entity.pos) < 1.5*NOWWINDOWSIZE)
        entity.draw(canv, shiftX, shiftY, playerPos);
    }
  }
}
Cave.number = 1;
Cave.numbLandmarkAreas = 0;

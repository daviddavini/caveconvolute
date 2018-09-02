class Cluster {
  constructor(game, levelInfo, explorerInfo){
    this.game = game;
    this.levelInfo = levelInfo;
    this.explorerInfo = explorerInfo;

    this.caves = {};
    this.totalFreePlugs = 0;
    this.totalFreeOutlets = 0;
    this.spawnManagers = {};
    this.spawnManagers["home"] = new SpawnManager([
    ]);
    this.spawnManagers["strand"] = new SpawnManager([
      new SpawnWatcher({className:Flower, defInfo:{}, numb:40, groupNumbRange:[3, 7], spawnRate:0, print:"flower"}),
      new SpawnWatcher({className:Fuel, defInfo:{}, numb:4, spawnRate:1/30, print:"fuel"}),
      new SpawnWatcher({className:Rock, defInfo:{}, numb:1, spawnRate:1/30, print:"fuel"}),
      new SpawnWatcher({className:Monster, defInfo:{}, numb:levelInfo.monsterNumb, spawnRate:1/30, groupNumbRange:[1, 3], print:"monster"}),
      new SpawnWatcher({className:Crawler, defInfo:{}, numb:levelInfo.crawlerNumb, spawnRate:1/30, print:"crawler"}),
      new SpawnWatcher({className:Bat, defInfo:{}, numb:levelInfo.batNumb, spawnRate:1/30, print:"bat"})
    ]);
    this.spawnManagers["quarry"] = new SpawnManager([
      new SpawnWatcher({className:Rock, defInfo:{}, numb:4, spawnRate:1/30, print:"rock"})
    ]);
    this.spawnManagers["oasis"] = new SpawnManager([
      new SpawnWatcher({className:Flower, defInfo:{}, numb:300, groupNumbRange:[3, 10], spawnRate:0, print:"flower"})
    ]);
    this.spawnManagers["dungeon"] = new SpawnManager([
      new SpawnWatcher({className:Monster, defInfo:{}, numb:20, spawnRate:1/60, print:"monster"}),
      new SpawnWatcher({className:Crawler, defInfo:{}, numb:5, spawnRate:1/60, print:"crawler"})
    ]);
    this.spawnManagers["exit"] = new SpawnManager([]);
    this.spawnManagers["traderoom"] = new SpawnManager([]);
    this.spawnManagers["link"] = new SpawnManager([]);
    this.spawnManagers["startlink"] = new SpawnManager([]);
    this.lootManager = new LootManager([
      {dyings:[{className:Crawler, chanceMult:3}, {className:Monster, chanceMult:1}, {className:Bat, chanceMult:5}],
        borns:[{className:Heart, chance:1/20, definingParam:{}},
              {className:Holder, chance:1/20, definingParam:{className:Fuel}},
              {className:Holder, chance:1/40, definingParam:{className:Rock}},
              {className:Holder, chance:1/30, definingParam:{className:Entity}},
              {className:Stone, chance:1/60, definingParam:{type:"speed"}},
              {className:Stone, chance:1/60, definingParam:{type:"strength"}}]},
      {dyings:[{className:Bat}],
        borns:[{className:Wing, chance:7/10, definingParam:{}}]},
      {dyings:[{className:Monster}],
        borns:[{className:Slime, chance:7/10, definingParam:{}}]},
      {dyings:[{className:Crawler}],
        borns:[{className:Eye, chance:7/10, definingParam:{}}]}
    ]);
    var cavesToAdd = [];
    for(var i = 0; i < levelInfo.strandNumb; i++){
      cavesToAdd.push(new Cave(this.game, "strand", this));
    }
    for(var i = 0; i < levelInfo.quarryNumb; i++){
      cavesToAdd.push(new Cave(this.game, "quarry", this));
    }
    for(var i = 0; i < levelInfo.traderoomNumb; i++){
      cavesToAdd.push(new Cave(this.game, "traderoom", this));
    }
    for(var i = 0; i < 3; i++){
      cavesToAdd.push(new Cave(this.game, "oasis", this));
    }
    this.exitCave = new Cave(this.game, "exit", this);
    cavesToAdd.push(this.exitCave);
    //shuffleArray(cavesToAdd);
    this.makeConnections(cavesToAdd);
    for(var id in this.spawnManagers){
      this.spawnManagers[id].spawnStartEntities();
    }
  }
  addPlayer(playerInfo){
    console.log("hey", playerInfo)
    return this.startlinkCave.spawnEntity(Player, playerInfo, this.startlinkCave.caveMap.getPlayerSpot());
  }
  finishLevel(playerInfo){
    for(var id in this.caves){
      this.caves[id].finishLevel(playerInfo);
    }
    this.game.finishLevel(playerInfo);
  }
  update(dt){
    for(var id in this.spawnManagers){
      this.spawnManagers[id].update(dt);
    }
  }
  addCave(cave){
    cave.cluster = this;
    this.caves[cave.id] = cave;
    this.totalFreePlugs += cave.caveMap.numbOfFreePlugs;
    this.totalFreeOutlets += cave.caveMap.numbOfFreeOutlets;
    this.lootManager.addCave(cave);
    cave.setLootManager(this.lootManager);
    this.spawnManagers[cave.type].addCave(cave);
    cave.addSpawnManager(this.spawnManagers[cave.type]);
    console.log(cave.type, this.spawnManagers[cave.type]);
  }
  makeConnection(plugCave, outletCave){
    do{
      var outlet = randomProp(outletCave.caveMap.freeOutlets);
      //console.log(outlet);
      var successfulPlugConnect = plugCave.caveMap.connectTo(outlet);
      if(!successfulPlugConnect){
        this.totalFreePlugs -= 1;
        if(!plugCave.caveMap.numbOfFreePlugs){
          console.log("this connection isnt actually happening...awkward")
          return false;
        }
      }
    }while (!successfulPlugConnect);
    this.totalFreePlugs -= 1;
    this.totalFreeOutlets -= 1;
  }
  getPlugCaveFrom(cavesToAdd){
    for(var i = 0; i < cavesToAdd.length; i++){
      if(cavesToAdd[i].caveMap.numbOfFreePlugs > 0){
        var plugCave = cavesToAdd[i];
        this.addCave(plugCave);
        cavesToAdd.splice(i,1);
        //this.addCave(plugCave);
        return plugCave;
      }
    }
    return null;
  }
  getOutletCaveFrom(cavesToAdd){
    for(var i = 0; i < cavesToAdd.length; i++){
      if(cavesToAdd[i].caveMap.numbOfFreeOutlets > 0){
        var outletCave = cavesToAdd[i];
        this.addCave(outletCave);
        cavesToAdd.splice(i,1);
        //this.addCave(outletCave);
        //why is that necessary?!!
        return outletCave;
      }
    }
    return null;
  }
  getPlugCave(){
    for(var id in this.caves){
      if(this.caves[id].caveMap.numbOfFreePlugs){
        return this.caves[id];
      }
    }
    return false;
  }
  getOutletCave(){
    for(var id in this.caves){
      if(this.caves[id].caveMap.numbOfFreeOutlets){
        return this.caves[id];
      }
    }
    return false;
  }
  makeConnections(cavesToAdd){
    this.caves = {};
    this.totalFreePlugs = 0;
    this.totalFreeOutlets = 0;
    this.home = new Cave(this.game, "home", this);
    this.addCave(this.home);

    while(cavesToAdd.length){
      console.log(this.totalFreePlugs, this.totalFreeOutlets);
      var plugCave = null;
      var outletCave = null;
      if(this.totalFreePlugs <= 0 && this.totalFreeOutlets <= 0){
        console.log("ran out of connectors!! this shouldnt be happening!!!");
      }
      if(this.totalFreePlugs <= 0){
        console.log(1);
        var outletCave = this.getOutletCave();
        if(this.totalFreeOutlets > 1){
          var plugCave = this.getPlugCaveFrom(cavesToAdd);
          if(!plugCave){
            var plugCave = new Cave(this.game, "strand", this);
            this.addCave(plugCave);
            console.log("added extra strand ", plugCave);
          }
        } else{
          var plugCave = new Cave(this.game, "strand", this);
          this.addCave(plugCave);
          console.log("added extra strand ", plugCave);
        }
      } else if(this.totalFreeOutlets <= 0){
        console.log(2);
        var plugCave = this.getPlugCave();
        if(this.totalFreePlugs > 1){
          var outletCave = this.getOutletCaveFrom(cavesToAdd);
          if(!outletCave){
            var outletCave = new Cave(this.game, "strand", this);
            this.addCave(outletCave);
            console.log("added extra strand ", outletCave);
          }
        } else{
          var outletCave = new Cave(this.game, "strand", this);
          this.addCave(outletCave);
          console.log("added extra strand ", outletCave);
        }
      } else{
        console.log(3);
        var addOutlet = Math.random() < 0.5;
        if(addOutlet){
          var plugCave = this.getPlugCave();
          var outletCave = this.getOutletCaveFrom(cavesToAdd);
          if(!outletCave){
            outletCave = this.getOutletCave();
            plugCave = this.getPlugCaveFrom(cavesToAdd);
          }
        } else{
          var outletCave = this.getOutletCave();
          var plugCave = this.getPlugCaveFrom(cavesToAdd);
          if(!plugCave){
            plugCave = this.getPlugCave();
            outletCave = this.getOutletCaveFrom(cavesToAdd);
          }
        }
      }
      this.makeConnection(plugCave, outletCave);
    }
    while(this.totalFreePlugs && this.totalFreeOutlets){
      var plugCave = this.getPlugCave();
      var outletCave = this.getOutletCave();
      this.makeConnection(plugCave, outletCave);
    }
    this.exitCave.caveMap.addConnectors(["up"]);
    this.totalFreeOutlets += 1;
    var linkCave = new Cave(this.game, "link", this);
    this.addCave(linkCave);
    this.makeConnection(linkCave, this.exitCave);

    this.home.caveMap.addOutlet(Math.PI/2);
    this.totalFreeOutlets += 1;
    this.startlinkCave = new Cave(this.game, "startlink", this);
    this.addCave(this.startlinkCave);
    this.makeConnection(this.startlinkCave, this.home);
    console.log(this.caves);
  }
  makeConnectionFor(outlet){
    //console.log("this  should not be running");
    if(this.totalFreePlugs > 0){
      var successfulPlugConnect = false;
      do{
        var cave = randomProp(this.caves);
        while(!cave.caveMap.numbOfFreePlugs){
          cave = randomProp(this.caves);
        }
        successfulPlugConnect = cave.caveMap.connectTo(outlet);
        if(!successfulPlugConnect){
          this.totalFreePlugs -= 1;
        }
      }while (!successfulPlugConnect);
      this.totalFreePlugs -= 1;
      this.totalFreeOutlets -= 1;
      console.log(this.totalFreePlugs+" plugs left");
      console.log(this.totalFreeOutlets+" outlets left");
      return true;
    } else{
      console.log("all used up");
      return false;
    }
  }
}

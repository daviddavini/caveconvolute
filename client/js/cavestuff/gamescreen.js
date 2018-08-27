class GameScreen extends Screen{
  constructor(pos, size, socket, explorerInfo, playerInfo){
    super(pos, size);
    this.socket = socket;
    this.socket.on('saveAccountReturn', wrapFunction(this.savePlayerInfoReturn, this));
    this.explorerInfo = explorerInfo;
    if(!this.explorerInfo.level)
      this.explorerInfo.level = 1;
    console.log("playerinfo", playerInfo);
    this.playerInfo = playerInfo || {
      hp: 5,
      maxHp: 5,
      spd: 10,
      throwSpd: 8,
      fuelSlotNumb: 3,
      rockSlotNumb: 1,
      itemSlotNumb: 3,
      fuelInfos: [],
      rockInfos: [],
      itemInfos: []
    }
    this.setForLevelSetup();
  }
  savePlayerInfo(){
    this.socket.emit('saveAccount', {
      username: this.explorerInfo.name,
      password: this.explorerInfo.code,
      playerInfo: this.playerInfo,
      explorerInfo: this.explorerInfo
    });
  }
  savePlayerInfoReturn(data){
    if(data.success){
      this.setForLevelSetup();
      console.log(data);
    } else{
      console.log(data, "hey, things arent working");
    }
  }
  finishLevel(playerInfo){
    this.playerInfo = playerInfo;
    this.caveOpen = false;
    this.levelChange();
    this.savePlayerInfo();
  }
  setForLevelSetup(){
    this.drawLoadScreen();
    this.doLevelSetupOnUpdate = true;
  }
  levelSetup(level){
    Fire.reset();
    var levelInfo = this.getLevelInfo(level);
    this.caves = {};
    this.cluster = new Cluster(this, levelInfo);
    this.player = this.cluster.addPlayer(this.playerInfo);
    this.caveOpen = true;
  }
  levelChange(){
    this.explorerInfo.level++;
  }
  update(dt){
    super.update(dt);
    if(this.doLevelSetupOnUpdate){
      this.levelSetup(this.explorerInfo.level);
      this.doLevelSetupOnUpdate = false;
    }
    if(this.caveOpen){
      this.cluster.update(dt);
      for(var id in this.caves){
        this.caves[id].update(dt);
      }
    }
  }
  draw(canv){
    canv.fillStyle = BACKCOLOR;
    canv.fillRect(0, 0, canv.canvas.width, canv.canvas.height);
    if(this.caveOpen)
      this.player.displayScreen(canv);
    super.draw(canv);
  }
  drawLoadScreen(){
    ctx.fillStyle = "#0F1521";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#87BBFF";
    ctx.font = "41px ArcadeClassic";
    var loadingText = "GENERATING  CAVE  SYSTEM...";
    ctx.fillText(loadingText,
      ctx.canvas.width/2-ctx.measureText(loadingText).width/2,
      ctx.canvas.height/2);
  }
  getLevelInfo(level){
    if(level === 1){
      return {
        strandNumb: 0,
        quarryNumb: 0,
        traderoomNumb: 1,
        oasisNumb: 0,
        monsterNumb: 5,
        crawlerNumb: 0,
        batNumb: 0,
        keeperValueRange: [0,3],
        traderValueRange: [0,5],
      }
    }else if(level === 2){
      return {
        strandNumb: 0,
        quarryNumb: 0,
        oasisNumb: 0,
        traderoomNumb: 1,
        monsterNumb: 8,
        crawlerNumb: 3,
        batNumb: 1,
        keeperValueRange: [1,3],
        traderValueRange: [1,5],
      }
    }
  }
}

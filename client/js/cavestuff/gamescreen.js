class GameScreen extends Screen{
  constructor(pos, size, socket, explorerInfo, playerInfo){
    super(pos, size);
    this.socket = socket;
    this.socket.on('saveAccountReturn', wrapFunction(this.savePlayerInfoReturn, this));
    this.level = 1;
    this.explorerInfo = explorerInfo;
    this.playerInfo = playerInfo || {
      hp: 5,
      maxHp: 5,
      spd: 10,
      throwSpd: 8,
      fuelSlotNumb: 3,
      rockSlotNumb: 1,
      itemSlotNumb: 3,
      fuelInfos: [{className:Fuel, defInfo:{}}],
      rockInfos: [{className:Rock, defInfo:{hp:3}}],
      itemInfos: [{className:Stone, defInfo:{type:"speed"}}]
    }
    this.setForLevelSetup();
  }
  savePlayerInfoReturn(data){
    if(data.success){
      this.caveOpen = true;
      console.log(data);
    } else{
      console.log("hey, things arent working");
    }
  }
  savePlayerInfo(){
    this.socket.emit('saveAccount', {
      username: explorerInfo.name,
      password: explorerInfo.code,
      playerInfo: this.playerInfo
    });
  }
  finishLevel(playerInfo){
    this.playerInfo = playerInfo;
    this.savePlayerInfo();
    this.levelChange();
    this.setForLevelSetup();
  }
  setForLevelSetup(){
    this.drawLoadScreen();
    this.doLevelSetupOnUpdate = true;
    this.caveOpen = false;
  }
  levelSetup(level){
    Fire.reset();
    var levelInfo = this.getLevelInfo(level);
    this.caves = {};
    this.cluster = new Cluster(this, levelInfo);
    this.player = this.cluster.addPlayer(this.playerInfo);
    //this.caveOpen = true;
    //wait until save return to open cave
  }
  levelChange(){
    this.level++;
  }
  update(dt){
    super.update(dt);
    if(this.doLevelSetupOnUpdate){
      this.levelSetup(this.level);
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

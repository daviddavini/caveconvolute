class GameScreen extends Screen{
  constructor(){
    super();
    this.level = 1;
    this.setForLevelSetup();
  }
  finishLevel(){
    this.levelChange();
    this.setForLevelSetup();
  }
  setForLevelSetup(){
    this.drawLoadScreen();
    this.doLevelSetupOnUpdate = true;
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
  levelSetup(level){
    var playerInventory = this.player ? this.player.inventory : false;
    Fire.reset();
    if(level === 1){
      var levelInfo = {
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
      this.caves = {};
      this.cluster = new Cluster(this, levelInfo);
      this.player = new Player(this.cluster.startlinkCave,
        this.cluster.startlinkCave.caveMap.getPlayerSpot(), playerInventory);
    } if (level === 2){
      var levelInfo = {
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
      this.caves = {};
      this.cluster = new Cluster(this, levelInfo);
      this.player = new Player(this.cluster.startlinkCave,
        this.cluster.startlinkCave.caveMap.getPlayerSpot(), playerInventory);
    }
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
    this.cluster.update(dt);
    for(var id in this.caves){
      this.caves[id].update(dt);
    }
  }
  draw(canv){
    canv.fillStyle = BACKCOLOR;
    canv.fillRect(0, 0, canv.canvas.width, canv.canvas.height);
    this.player.displayScreen(canv);
    super.draw(canv);
  }
}

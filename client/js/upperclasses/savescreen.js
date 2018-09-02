class SaveScreen extends Screen{
  constructor(pos, size, socket, explorerInfo, playerInfo){
    super(pos, size);
    this.socket = socket;
    this.explorerInfo = explorerInfo;
    this.playerInfo = playerInfo;
    socket.on('saveAccountReturn', wrapFunction(this.saveAccountReturn, this));
    this.buttons = {};
    this.buttons.newExplorer = this.createButton(
      "                     save   &   quit",
      this.pos.x+this.size.x*0.5, this.pos.y+this.size.y*0.7, 250,
      wrapFunction(this.saveAndQuit, this));
    this.buttons.oldExplorer = this.createButton(
      "                           continue",
      this.pos.x+this.size.x*0.5, this.pos.y+this.size.y*0.8, 250,
      wrapFunction(this.continue, this));
    console.log(this.buttons);
    this.backgroundColor = "#253245";
    this.fireSprite = new Sprite(assetManager.getImage("player"), new Vector(0,0), new Vector(1,11/8));
  }
  saveAndQuit(){
    console.log(this.explorerInfo, this.playerInfo);
    this.socket.emit('saveAccount', {
      username: this.explorerInfo.name,
      password: this.explorerInfo.code,
      playerInfo: this.playerInfo,
      explorerInfo: this.explorerInfo
    });
  }
  saveAccountReturn(data){
    if(data.success){
      console.log(data, "hellow")
      this.nextScreen(new TitleScreen(this.pos, this.size, this.socket));
    } else{
      console.log(data, "hey, things arent working");
    }
  }
  continue(){
    this.nextScreen(new GameScreen(this.pos, this.size, this.socket, this.explorerInfo, this.playerInfo));
  }
  endScreen(){
    for(var id in this.buttons){
      this.buttons[id].destroy();
      console.log(this.buttons);
    }
    super.endScreen();
  }
  update(dt){
    this.fireSprite.tick(dt);
  }
  doDraw(canv){
    this.drawBackground(canv);
    for(var id in this.buttons){
      this.buttons[id].render();
    }
    this.fireSprite.drawStraight(canv, this.pos.x+this.size.x*0.51, this.pos.y+this.size.y*0.37, 200);
  }
  draw(canv){
    this.doDraw(canv);
  }
}

class TitleScreen extends Screen{
  constructor(pos, size, socket){
    super(pos, size);
    this.socket = socket;
    this.errorText = "";
    this.explorerInfo = null;
    socket.on('createAccountReturn', wrapFunction(this.newExplorerReturn, this));
    socket.on('loadAccountReturn', wrapFunction(this.oldExplorerReturn, this));
    this.buttons = {};
    this.buttons.newExplorer = this.createButton("   new   explorer",
        this.pos.x+this.size.x*0.25, this.pos.y+this.size.y*0.8, 150,
        wrapFunction(this.newExplorer, this));
    this.buttons.oldExplorer = this.createButton("   old   explorer",
        this.pos.x+this.size.x*0.5, this.pos.y+this.size.y*0.8, 150,
        wrapFunction(this.oldExplorer, this));
    this.buttons.leaderBoard = this.createButton("   leader   board",
        this.pos.x+this.size.x*0.75, this.pos.y+this.size.y*0.8, 150,
        wrapFunction(this.nextScreen, this));
    console.log(this.buttons);
    this.inputName = this.createInput("name",
      this.pos.x+this.size.x*0.7, this.pos.y+this.size.y*0.47, 220);
    this.inputPass = this.createInput("password",
      this.pos.x+this.size.x*0.7, this.pos.y+this.size.y*0.58, 220);
    this.backgroundColor = "#253245";
    this.fireSprite = new Sprite(assetManager.getImage("firebig"), new Vector(0,0), new Vector(1,1), 3, 6);
  }
  newExplorer(){
    this.explorerInfo = {name:this.inputName.value().toLowerCase(), code:this.inputPass.value().toLowerCase()};
    console.log(this.explorerInfo.name, this.explorerInfo.code);
    this.socket.emit('createAccount', {
      username: this.explorerInfo.name,
      password: this.explorerInfo.code
    });
  }
  newExplorerReturn(data){
    if(data.success){
      console.log(this.explorerInfo);
      this.nextScreen(new GameScreen(this.pos, this.size, this.socket, this.explorerInfo));
    }else{
      console.log(this.explorerInfo.name, this.explorerInfo.code);
      console.log("failure: ", data.reason);
      if(data.reason === "duplicate")
        this.errorText = "account   already   exists";
      else if(data.reason === "empty")
        this.errorText = "enter   in   username   and   password";
    }
  };
  oldExplorer(){
    this.explorerInfo = {name:this.inputName.value().toLowerCase(), code:this.inputPass.value().toLowerCase()};
    console.log(this.explorerInfo.name, this.explorerInfo.code);
    this.socket.emit('loadAccount', {
      username: this.explorerInfo.name,
      password: this.explorerInfo.code
    });
  }
  oldExplorerReturn(data){
    if(data.success){
      console.log(data);
      this.nextScreen(new GameScreen(this.pos, this.size, this.socket, data.explorerInfo, data.playerInfo));
    }else{
      console.log("failure: ", data.reason);
      if(data.reason === "nonexistant")
        this.errorText = "account   doesn't    exist";
      else if(data.reason === "empty")
        this.errorText = "enter   in   username   and   password";
      else if(data.reason === "notmatching")
        this.errorText = "incorrect   password";
    }
  }
  leaderBoard(){

  }
  endScreen(){
    this.inputName.destroy();
    this.inputPass.destroy();
    for(var id in this.buttons){
      this.buttons[id].destroy();
      delete this.buttons[id];
      console.log("@@@@@@@@@", this.buttons);
    }
    super.endScreen();
  }
  update(dt){
    console.log("value:" + this.inputName.value());
    this.fireSprite.tick(dt);
  }
  drawTitle(canv){
    canv.fillStyle = "#87BBFF";
    canv.font = "120px ArcadeClassic";
    var topText = "cave";
    canv.fillText(topText, this.pos.x+this.size.x*0.15, this.pos.y+this.size.y*0.17);
    var bottomText = "convolute!";
    canv.fillText(bottomText, this.pos.x+this.size.x*0.15, this.pos.y+this.size.y*0.29);
  }
  doDraw(canv){
    this.drawBackground(ctx);
    this.drawTitle(ctx);
    for(var id in this.buttons){
      this.buttons[id].render();
    }
    this.inputName.render();
    this.inputPass.render();
    this.fireSprite.drawStraight(canv, this.pos.x+this.size.x*0.3, this.pos.y+this.size.y*0.56, 200);
    canv.fillStyle = "#ff0000";
    canv.font = "27px ArcadeClassic";
    canv.fillText(this.errorText,
      canv.canvas.width/2-canv.measureText(this.errorText).width/2,
      canv.canvas.height*0.91);
  }
  draw(canv){
    this.doDraw(canv);
  }
}

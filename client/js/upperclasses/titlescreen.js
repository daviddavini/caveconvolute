class TitleScreen extends Screen{
  constructor(pos, size, socket){
    super(pos, size);
    this.socket = socket;
    this.explorerInfo = null;
    socket.on('createAccountReturn', wrapFunction(this.newExplorerReturn, this));
    socket.on('loadAccountReturn', wrapFunction(this.oldExplorerReturn, this));
    this.buttons = [];
    this.buttons.newExplorer = this.createButton("   new   explorer",
        this.pos.x+this.size.x*0.25, this.pos.y+this.size.y*0.8, 150,
        wrapFunction(this.newExplorer, this));
    this.buttons.oldExplorer = this.createButton("   old   explorer",
        this.pos.x+this.size.x*0.5, this.pos.y+this.size.y*0.8, 150,
        wrapFunction(this.oldExplorer, this));
    this.buttons.leaderBoard = this.createButton("   leader   board",
        this.pos.x+this.size.x*0.75, this.pos.y+this.size.y*0.8, 150,
        wrapFunction(this.nextScreen, this));
    console.log(this.buttons[0]);
    this.inputName = this.createInput("name",
      this.pos.x+this.size.x*0.7, this.pos.y+this.size.y*0.47, 220);
    this.inputPass = this.createInput("password",
      this.pos.x+this.size.x*0.7, this.pos.y+this.size.y*0.58, 220);
    this.backgroundColor = "#253245";
    this.fireSprite = new Sprite(assetManager.getImage("firebig"), new Vector(0,0), new Vector(1,1), 3, 6);
  }
  newExplorer(){
    this.explorerInfo = {name:this.inputName.value().toLowerCase();, code:this.inputPass.value().toLowerCase();};
    this.socket.emit('createAccount', {
      username: this.explorerInfo.name,
      password: this.explorerInfo.code
    });
  }
  newExplorerReturn(data){
    if(data.success){
      this.nextScreen(new GameScreen(this.pos, this.size, this.socket, this.explorerInfo));
    }else{
      console.log("failure: ", data.reason);
    }
  };
  oldExplorer(){
    this.explorerInfo = {name:this.inputName.value().toLowerCase(), code:this.inputPass.value().toLowerCase()};
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
    }
  }
  leaderBoard(){

  }
  createBox(text, x, y, width, info){
    return new CanvasInput({
      canvas: canvas,
      x:x-width/2,
      y:y,
      fontSize: 18,
      fontFamily: 'ArcadeClassic',
      fontColor: '#fff',
      fontSize: 22,
      //fontWeight: 'bold',
      width: width,
      padding: 7,
      borderWidth: 3,
      borderColor: "#425C7D",
      backgroundColor:info.backgroundColor,
      borderRadius: 0,
      boxShadow: '1px 1px 0px #2C3D60',
      //innerShadow: '0px 0px 5px rgba(0 , 0, 0, 0.5)',
      placeHolder: text,

      onsubmit: info.onsubmit !== undefined ? info.onsubmit : function(){},
      readonly: info.readonly !== undefined ? info.readonly : false,
      onfocus: info.onfocus !== undefined ? info.onfocus : function(){},
    });
  }
  createInput(text, x, y, width, onsubmit){
    var info = {
      onsubmit:onsubmit,
      backgroundColor:"#0F1521",
    }
    return this.createBox(text, x, y, width, info);
  }
  createButton(text, x, y, width, onfocus){
    var info = {
      readonly:true,
      onfocus:onfocus,
      backgroundColor:"#3A506E",
    }
    return this.createBox(text, x, y, width, info);
  }
  endScreen(){
    this.inputName.destroy();
    this.inputPass.destroy();
    for(var id in this.buttons){
      this.buttons[id].destroy();
    }
    super.endScreen();
  }
  update(dt){
    console.log(this.inputName.value());
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
  }
  draw(canv){
    this.doDraw(canv);
  }
}

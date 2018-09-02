class Screen {
  constructor(pos, size){
    if(pos && size){
      this.pos = pos;
      this.size = size;
    }else {
      this.pos = new Vector(0,0);
      this.size = new Vector(ctx.canvas.width, ctx.canvas.height);
    }
    this.followScreen = null;
    this.backgroundColor = "#000";
    console.log(this.pos, this.size);
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
  }
  nextScreen(followScreen){
    this.followScreen = followScreen;
    this.endScreen();
  }
  update(dt){
  }
  drawBackground(canv){
    canv.fillStyle = this.backgroundColor;
    canv.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
  }
  doDraw(canv){
  }
  draw(canv){
  }
}

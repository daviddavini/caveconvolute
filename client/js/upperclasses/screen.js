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

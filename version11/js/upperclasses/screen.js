class Screen {
  constructor(pos, size){
    if(pos && size){
      this.pos = pos;
      this.size = size;
    }else {
      this.pos = new Vector(0,0);
      this.size = new Vector(ctx.canvas.width, ctx.canvas.height);
    }
    this.gotoNextScreen = false;
    this.backgroundColor = "#000";
    console.log(this.pos, this.size);
  }
  endScreen(){
  }
  nextScreen(){
    this.gotoNextScreen = true;
    this.endScreen();
  }
  update(dt){
  }
  drawBackground(canv){
    canv.fillStyle = this.backgroundColor;
    canv.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
  }
  draw(canv){
  }
}

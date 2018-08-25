class Sprite{
  constructor(image, posChange, size, frames, speed, once) {
    if(speed){
      this.speed = speed;
    } else{
      this.speed = 0;
    }
    this.image = image;
    if(frames){
      this.frames = frames;
    }else {
      this.frames = 1;
      this.speed = 0;
    }
    if(once){
      this.once = once;
    } else{
      this.once = false;
    }
    this.posChange = posChange;
    this.size = size;
    this.counter = 0;
    this.index = 0;
    this.dir = 'vertical';
    this.once = once;
  }
  setSpeed(speed){
    this.speed = speed;
  }
  nextFrame(){
    this.counter += 1;
    this.index += 1;
    if(this.counter >= this.frames){
      if(this.once){
        this.counter = this.frames - 1;
        this.speed = 0;
      } else{
        this.counter -= this.frames;
      }
    }
  }
  tick(dt) {
    if(this.speed !== 0){
      this.counter += this.speed*dt;
      if(this.counter >= this.frames){
        if(this.once){
          this.counter = this.frames - 1;
          this.speed = 0;
        } else{
          this.counter -= this.frames;
        }
      }
      this.index = Math.floor(this.counter);
    }
  }
  draw(canv, shiftX, shiftY) {
    if(this.dir === 'vertical'){
      canv.drawImage(this.image, 0, this.index*this.image.naturalHeight/this.frames,
                    this.image.naturalWidth, this.image.naturalHeight/this.frames,
                    (shiftX+this.posChange.x)*FSIZE, (shiftY+this.posChange.y)*FSIZE, this.size.x*FSIZE, this.size.y*FSIZE);
    } else{
      canv.drawImage(this.image, this.index*this.image.naturalWidth/this.frames, 0,
                    this.image.naturalWidth/this.frames, this.image.naturalHeight,
                    (shiftX+pos.x+this.posChange.x)*FSIZE, (shiftY+pos.y+this.posChange.y)*FSIZE, this.size.x*FSIZE, this.size.y*FSIZE);
    }
  }
  drawStraight(canv, x, y, size){
    var sizex = size;
    var sizey = size*this.size.y/this.size.x;
    canv.drawImage(this.image, 0, this.index*this.image.naturalHeight/this.frames,
                  this.image.naturalWidth, this.image.naturalHeight/this.frames,
                  x-sizex/2, y-sizey/2, sizex, sizey);
  }
}

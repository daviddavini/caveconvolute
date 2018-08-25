class InputMove extends PhysicsMove{
  constructor(entity){
    super(entity);
    InputMove.inputMoves.push(this);
    this.movingLeft = false;
    this.movingRight = false;
    this.movingUp = false;
    this.movingDown = false;
  }
  update(dt){
    this.entity.vel.set(this.entity.dir.times(this.entity.spd));
    super.update(dt);
  }
  updateDir(){
    this.entity.dir.set(new Vector(0,0));
    this.entity.dir.x += this.movingRight ? 1 : 0;
    this.entity.dir.x += this.movingLeft ? -1 : 0;
    this.entity.dir.y += this.movingDown ? 1 : 0;
    this.entity.dir.y += this.movingUp ? -1 : 0;
    this.entity.dir.normalize();
  }
  keyPress(data){
    if(data.type === "move"){
      if(data.inputId === "moveLeft"){
        this.movingLeft = data.state;
      } else if(data.inputId === "moveRight"){
        this.movingRight = data.state;
      } else if(data.inputId === "moveUp"){
        this.movingUp = data.state;
      } else if(data.inputId === "moveDown"){
        this.movingDown = data.state;
      }
      this.updateDir();
    } else if(data.type === "speed"){
      this.entity.spd = data.state ? this.entity.fastSpd : this.entity.slowSpd;
    } else if(data.type === "throw"){
      if(data.state){
        console.log(data.mousePos.x, data.mousePos.y);
        this.entity.throwDir.set(data.mousePos.getUnit());
        if(!this.entity.states.holdingItem.on){
          this.entity.prepareThrow();
        }
      } else{
        this.entity.doThrowByAim(this.entity.pos.plus(data.mousePos));
      }
    } else if(data.type === "inventoryToggle"){
      if(this.entity.inventory){
        this.entity.inventory.toggleSelection(data.change);
      }
    } else if(data.type === "grab"){
      if(data.state)
        this.entity.pickupItems();
      // if(data.state) {
      //   this.entity.states.grabbing.start();
      // }else {
      //   this.entity.states.grabbing.finish(0);
      // }
    }
  }
}
InputMove.inputMoves = [];
InputMove.keyPress = function(data){
  for(var inputMove of InputMove.inputMoves){
    inputMove.keyPress(data);
  }
}

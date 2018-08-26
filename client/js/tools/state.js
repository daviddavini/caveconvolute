class State{
  constructor(name, entity, maxCount, countRange, autoreset){
    this.entity = entity;
    this.name = name;
    this.entity.states[this.name] = this;
    this.max = maxCount ? maxCount : "inf";
    this.range = countRange ? countRange : 0;
    this.count = 0;
    this.autoreset = autoreset ? autoreset : false;
    this.on = false;
  }
  start(){
    this.count = this.range ? this.max + Math.random()*this.range : this.max;
    this.on = true;
    this.entity.handleStateStart.call(this.entity, this.name);
  }
  finish(dt){
    this.count = 0;
    this.on = false;
    this.entity.handleStateFinish.call(this.entity, this.name, dt);
  }
  update(dt){
    if(this.max !== "inf" && this.on){
      this.count -= dt;
      if(this.count <= 0){
        this.finish(dt);
        if(this.autoreset){
          this.start();
        }
      }
    }
  }
}

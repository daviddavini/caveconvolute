class Box{
  constructor(pos, size){
    this.pos = pos;
    this.size = size;
  }
  posPlus(vec){
    return new Box(this.pos.plus(vec), this.size);
  }
  getTopLeftPos(){
    return this.pos;
  }
  getBottomRightPos(){
    return this.pos.plus(this.size);
  }
  randomInsidePos(){
    return this.pos.plus(new Vector(this.size.x*Math.random(), this.size.y*Math.random()));
  }
  isOverlapping(box){
    return ((this.pos.x <= box.pos.x && box.pos.x <= this.pos.x+this.size.x) ||
      (this.pos.x <= box.pos.x+box.size.x && box.pos.x+box.size.x <= this.pos.x+this.size.x))
      && ((this.pos.y <= box.pos.y && box.pos.y <= this.pos.y+this.size.y) ||
        (this.pos.y <= box.pos.y+box.size.y && box.pos.y+box.size.y <= this.pos.y+this.size.y))
  }
  getCenter(){
    return this.pos.plus(this.size.times(0.5));
  }
  xCorrection(box){
    var xCorrect = {};
    xCorrect.left = box.pos.x - (this.pos.x+this.size.x);
    xCorrect.right = box.pos.x+box.size.x - this.pos.x;
    if(this.getCenter().x > box.getCenter().x){
      xCorrect.smallest = xCorrect.right;
    }
    if(this.getCenter().x <= box.getCenter().x){ //wrong
      xCorrect.smallest = xCorrect.left;
    }
    return xCorrect;
  }
  yCorrection(box){
    var yCorrect = {};
    yCorrect.down = box.pos.y+box.size.y - this.pos.y;
    yCorrect.up = box.pos.y - (this.pos.y+this.size.y);
    if(this.getCenter().y > box.getCenter().y){
      yCorrect.smallest = yCorrect.down;
    }
    if(this.getCenter().y <= box.getCenter().y){
      yCorrect.smallest = yCorrect.up;
    }
    return yCorrect;
  }
  overlapFixBySmallest(box){
    if(!this.isOverlapping(box) && !box.isOverlapping(this)){
      return null;
    }
    var xCorrect = this.xCorrection(box);
    var yCorrect = this.yCorrection(box);
    if(Math.abs(xCorrect.smallest) < Math.abs(yCorrect.smallest)){
      return new Vector(xCorrect.smallest, 0);
    } else{
      return new Vector(0, yCorrect.smallest);
    }
  }
  isInRange(value, rangeStart, rangeEnd){
    return (value >= rangeStart && value < rangeEnd)
          || (value > rangeEnd && value <= rangeStart);
  }
  isInRangeExclusive(value, rangeStart, rangeEnd){
    return (value > rangeStart && value < rangeEnd)
          || (value > rangeEnd && value < rangeStart);
  }
  rangeValueToPercent(value, rangeStart, rangeEnd){
    return (value - rangeStart) / (rangeEnd - rangeStart);
  }
  percentToRangeValue(percent, range2Start, range2End){
    return range2Start + percent*(range2End - range2Start);
  }
  overlapFixByEntry(posChange, box){
    var xRangeStart = this.pos.x - posChange.x;
    var xRangeEnd = this.pos.x;
    var yRangeStart = this.pos.y - posChange.y;
    var yRangeEnd = this.pos.y;

    var xOverlapStart = box.pos.x - this.size.x;
    var xOverlapEnd = box.pos.x + box.size.x;
    var yOverlapStart = box.pos.y - this.size.y;
    var yOverlapEnd = box.pos.y + box.size.y;

    var earliestPercent = 2; //bigger than possible
    var earliestTouch = null;

    if(posChange.x > 0 && this.isInRange(xOverlapStart, xRangeStart, xRangeEnd)){
      var percent = this.rangeValueToPercent(xOverlapStart, xRangeStart, xRangeEnd);
      if(percent < earliestPercent){
        var yxOverlapStart = this.percentToRangeValue(percent, yRangeStart, yRangeEnd);
        if(this.isInRangeExclusive(yxOverlapStart, yOverlapStart, yOverlapEnd) ||
            ((yxOverlapStart === yOverlapStart || yxOverlapStart === yOverlapEnd)
                  && this.isInRange(yxOverlapStart, yRangeStart, yRangeEnd))  ){
          earliestPercent = percent;
          earliestTouch = "left";
        }
      }
    }
    if(posChange.x < 0 && this.isInRange(xOverlapEnd, xRangeStart, xRangeEnd)){
      var percent = this.rangeValueToPercent(xOverlapEnd, xRangeStart, xRangeEnd);
      if(percent < earliestPercent){
        var yxOverlapEnd = this.percentToRangeValue(percent, yRangeStart, yRangeEnd);
        if(this.isInRangeExclusive(yxOverlapEnd, yOverlapStart, yOverlapEnd) ||
            ((yxOverlapStart === yOverlapStart || yxOverlapStart === yOverlapEnd)
                  && this.isInRange(yxOverlapStart, yRangeStart, yRangeEnd))  ){
          earliestPercent = percent;
          earliestTouch = "right";
        }
      }
    }
    if(posChange.y > 0 && this.isInRange(yOverlapStart, yRangeStart, yRangeEnd)){
      var percent = this.rangeValueToPercent(yOverlapStart, yRangeStart, yRangeEnd);
      if(percent < earliestPercent){
        var xyOverlapStart = this.percentToRangeValue(percent, xRangeStart, xRangeEnd);
        if(this.isInRangeExclusive(xyOverlapStart, xOverlapStart, xOverlapEnd) ||
            ((xyOverlapStart === xOverlapStart || xyOverlapStart === xOverlapEnd)
                  && this.isInRange(xyOverlapStart, xRangeStart, xRangeEnd))  ){
          earliestPercent = percent;
          earliestTouch = "up";
        }
      }
    }
    if(posChange.y < 0 && this.isInRange(yOverlapEnd, yRangeStart, yRangeEnd)){
      var percent = this.rangeValueToPercent(yOverlapEnd, yRangeStart, yRangeEnd);
      if(percent < earliestPercent){
        var xyOverlapEnd = this.percentToRangeValue(percent, xRangeStart, xRangeEnd);
        if(this.isInRangeExclusive(xyOverlapEnd, xOverlapStart, xOverlapEnd) ||
            ((xyOverlapEnd === xOverlapStart || xyOverlapStart === xOverlapEnd)
                  && this.isInRange(xyOverlapEnd, xRangeStart, xRangeEnd))  ){
          earliestPercent = percent;
          earliestTouch = "down";
        }
      }
    }
    if(!earliestTouch){
      //console.log("no entry, just exit. bad sign");
      return false;
    }
    if(earliestTouch === "left" || earliestTouch === "right"){
      var xCorrect = this.xCorrection(box);
      return new Vector(xCorrect[earliestTouch], 0);
    } else if(earliestTouch === "up" || earliestTouch === "down"){
      var yCorrect = this.yCorrection(box);
      return new Vector(0, yCorrect[earliestTouch]);
    }
  }
  getOverlapFix(posChange, box){
    //looking for the earliest entry.
    //if there is one, correct to its edge
    //if not, do correction by smallest
    var overlapFixVec = this.overlapFixByEntry(posChange, box);
    if(!overlapFixVec){
      overlapFixVec = this.overlapFixBySmallest(box);
    }
    return overlapFixVec;
  }
  fixOverlap(overlapFixVec){
    this.pos.add(overlapFixVec);
  }
}

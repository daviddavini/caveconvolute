class Vector {
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
  //modifies the vector itself
  add(vec){
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }
  take(vec){
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  }
  mult(scal){
    this.x *= scal;
    this.y *= scal;
    return this;
  }
  divide(scal){
    this.x /= scal;
    this.y /= scal;
    return this;
  }
  normalize(){
    if(this.length())
      return this.divide(this.length());
    return this;
  }
  floor(){
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  }
  set(vec){
    this.x = vec.x;
    this.y = vec.y;
    return this;
  }
  //does not modify vector, produces new vector
  equals(vec){
    return this.x === vec.x && this.y === vec.y;
  }
  plus(vec){
    return new Vector(this.x+vec.x, this.y+vec.y);
  }
  minus(vec){
    return new Vector(this.x-vec.x, this.y-vec.y);
  }
  times(scal){
    return new Vector(this.x*scal, this.y*scal);
  }
  over(scal){
    return new Vector(this.x/scal, this.y/scal);
  }
  floored(){
    return new Vector(Math.floor(this.x), Math.floor(this.y));
  }
  ceiled(){
    return new Vector(Math.floor(this.x)+1, Math.floor(this.y)+1);
  }
  getUnit(){
    return this.over(this.length());
  }
  length(){
    return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2));
  }
  dist(vec){
    return Math.sqrt(Math.pow(this.x-vec.x,2)+Math.pow(this.y-vec.y,2));
  }
  angle(){
    return Math.atan2(this.y, this.x);
  }
  copy(){
    return new Vector(this.x, this.y);
  }
  dot(vec){
    return this.x * vec.x + this.y * vec.y;
  }
  inSquareAround(center, sideLength){
    return this.x >= center.x - sideLength/2 && this.x < center.x + sideLength/2
      && this.y >= center.y - sideLength/2 && this.y < center.y + sideLength/2;
  }

}
Vector.randUnit = function(){
  angle = Math.random()*2*Math.PI;
  return new Vector(Math.cos(angle), Math.sin(angle));
}
Vector.randUnitBetween = function(a, b){
  angle = Math.random()*(b-a)+a;
  return new Vector(Math.cos(angle), Math.sin(angle));
}
Vector.random = function(size){
  return Vector.randUnit().mult(size);
}
Vector.unit = function(angle){
  return new Vector(Math.cos(angle), Math.sin(angle));
}

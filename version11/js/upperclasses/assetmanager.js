class ImageAsset{
  constructor(assetmanager, name, filename, imagePackName){
    this.name = name;
    assetmanager.images[name] = this;
    this.file = filename;
    this.hasLoaded = false;
    this.image = null;
    if(imagePackName){
      assetmanager.imagePacks[imagePackName].push(this);
    }
  }
}

class AssetManager{
  constructor(){
    this.images = {};
    this.imagePacks = {};
    this.imagePacks["quarryground"] = [];
    new ImageAsset(this, "quarryground1", "img/quarryground1.png", "quarryground");
    new ImageAsset(this, "quarryground2", "img/quarryground2.png", "quarryground");
    new ImageAsset(this, "quarryground3", "img/quarryground3.png", "quarryground");
    new ImageAsset(this, "quarryground4", "img/quarryground4.png", "quarryground");
    this.imagePacks["ground"] = [];
    new ImageAsset(this, "ground1", "img/wall1.png", "ground");
    new ImageAsset(this, "ground2", "img/wall2.png", "ground");
    new ImageAsset(this, "ground3", "img/wall3.png", "ground");
    new ImageAsset(this, "ground4", "img/wall4.png", "ground");
    this.imagePacks["homeground"] = [];
    new ImageAsset(this, "homeground1", "img/blueground1.png", "homeground");
    new ImageAsset(this, "homeground2", "img/blueground2.png", "homeground");
    new ImageAsset(this, "homeground3", "img/blueground3.png", "homeground");
    new ImageAsset(this, "homeground4", "img/blueground4.png", "homeground");
    this.imagePacks["oasisground"] = [];
    new ImageAsset(this, "oasisground1", "img/oasis1.png", "oasisground");
    new ImageAsset(this, "oasisground2", "img/oasis2.png", "oasisground");
    new ImageAsset(this, "oasisground3", "img/oasis3.png", "oasisground");
    new ImageAsset(this, "oasisground4", "img/oasis4.png", "oasisground");
    this.imagePacks["greenground"] = [];
    new ImageAsset(this, "greenground1", "img/greenground1.png", "greenground");
    new ImageAsset(this, "greenground2", "img/greenground2.png", "greenground");
    new ImageAsset(this, "greenground3", "img/greenground3.png", "greenground");
    new ImageAsset(this, "greenground4", "img/greenground4.png", "greenground");
    this.imagePacks["waterground"] = [];
    new ImageAsset(this, "waterground1", "img/waterground1.png", "waterground");
    new ImageAsset(this, "waterground2", "img/waterground2.png", "waterground");
    new ImageAsset(this, "waterground3", "img/waterground3.png", "waterground");
    new ImageAsset(this, "waterground4", "img/waterground4.png", "waterground");
    this.imagePacks["lightground"] = [];
    new ImageAsset(this, "lightground1", "img/light1.png", "lightground");
    new ImageAsset(this, "lightground2", "img/light2.png", "lightground");
    new ImageAsset(this, "lightground3", "img/light3.png", "lightground");
    new ImageAsset(this, "lightground4", "img/light4.png", "lightground");
    this.imagePacks["darkground"] = [];
    new ImageAsset(this, "darkground1", "img/dark1.png", "darkground");
    new ImageAsset(this, "darkground2", "img/dark2.png", "darkground");
    new ImageAsset(this, "darkground3", "img/dark3.png", "darkground");
    new ImageAsset(this, "darkground4", "img/dark4.png", "darkground");
    this.imagePacks["blueground"] = [];
    new ImageAsset(this, "blueground1", "img/blueground1.png", "blueground");
    new ImageAsset(this, "blueground2", "img/blueground2.png", "blueground");
    new ImageAsset(this, "blueground3", "img/blueground3.png", "blueground");
    new ImageAsset(this, "blueground4", "img/blueground4.png", "blueground");
    this.imagePacks["dirtground"] = [];
    new ImageAsset(this, "dirtground1", "img/dirtground1.png", "dirtground");
    new ImageAsset(this, "dirtground2", "img/dirtground2.png", "dirtground");
    new ImageAsset(this, "dirtground3", "img/dirtground3.png", "dirtground");
    new ImageAsset(this, "dirtground4", "img/dirtground4.png", "dirtground");
    this.imagePacks["rockground"] = [];
    new ImageAsset(this, "rockground1", "img/rockground1.png", "rockground");
    new ImageAsset(this, "rockground2", "img/rockground2.png", "rockground");
    new ImageAsset(this, "rockground3", "img/rockground3.png", "rockground");
    new ImageAsset(this, "rockground4", "img/rockground4.png", "rockground");
    new ImageAsset(this, "rockground5", "img/rockground5.png", "rockground");
    new ImageAsset(this, "rockground6", "img/rockground6.png", "rockground");
    new ImageAsset(this, "rockground7", "img/rockground7.png", "rockground");
    new ImageAsset(this, "rockground8", "img/rockground8.png", "rockground");
    this.imagePacks["brownground"] = [];
    new ImageAsset(this, "brownground1", "img/brownground1.png", "brownground");
    new ImageAsset(this, "brownground2", "img/brownground2.png", "brownground");
    new ImageAsset(this, "brownground3", "img/brownground3.png", "brownground");
    new ImageAsset(this, "brownground4", "img/brownground4.png", "brownground");
    new ImageAsset(this, "groundoutline", "img/groundoutline.png");
    this.imagePacks["flowers"] = [];
    new ImageAsset(this, "redflower", "img/redflower.png", "flowers");
    new ImageAsset(this, "blueflower", "img/blueflower.png", "flowers");
    new ImageAsset(this, "purpleflower", "img/purpleflower.png", "flowers");
    new ImageAsset(this, "yellowflower", "img/yellowflower.png", "flowers");
    new ImageAsset(this, "whiteflower", "img/whiteflower.png", "flowers");
    new ImageAsset(this, "flowerflat", "img/flowerflat.png");
    new ImageAsset(this, "greengem", "img/greengem.png");
    new ImageAsset(this, "fuel", "img/stick.png");
    new ImageAsset(this, "wing", "img/wing.png");
    new ImageAsset(this, "coinbronze", "img/coinbronze.png");
    new ImageAsset(this, "coinsilver", "img/coinsilver.png");
    new ImageAsset(this, "coingold", "img/coingold.png");
    new ImageAsset(this, "tradebubble", "img/tradebubble.png");
    new ImageAsset(this, "tradebubblebig", "img/tradebubblebig.png");
    this.imagePacks["ghost"] = [];
    new ImageAsset(this, "ghostleft", "img/ghostleft.png", "ghost");
    new ImageAsset(this, "ghostright", "img/ghostright.png", "ghost");
    new ImageAsset(this, "ghosthurtleft", "img/ghosthurtleft.png", "ghost");
    new ImageAsset(this, "ghosthurtright", "img/ghosthurtright.png", "ghost");
    new ImageAsset(this, "rock", "img/bluerock.png");
    new ImageAsset(this, "playerwalking", "img/playerwalking.png");
    new ImageAsset(this, "player", "img/player.png");
    new ImageAsset(this, "bat", "img/bat.png");
    new ImageAsset(this, "fountain", "img/fountain.png");
    new ImageAsset(this, "barrel", "img/barrel.png");
    new ImageAsset(this, "column", "img/column.png");
    new ImageAsset(this, "bonestick", "img/bonecollection.png");
    new ImageAsset(this, "graveleft", "img/graveleft.png");
    new ImageAsset(this, "graveright", "img/graveright.png");
    new ImageAsset(this, "bear", "img/bearcape.png");
    new ImageAsset(this, "bibfaded", "img/bibfaded.png");
    new ImageAsset(this, "bibempty", "img/bibempty.png");
    new ImageAsset(this, "bibred", "img/bibred.png");
    new ImageAsset(this, "rockoutlinefull", "img/rockoutlinefull.png");
    new ImageAsset(this, "rockoutlineempty", "img/rockoutlineempty.png");
    new ImageAsset(this, "fueloutlinefull", "img/fueloutlinefull.png");
    new ImageAsset(this, "fueloutlineempty", "img/fueloutlineempty.png");
    new ImageAsset(this, "invoutlinefull", "img/invoutlinefull.png");
    new ImageAsset(this, "invoutlineempty", "img/invoutlineempty.png");
    new ImageAsset(this, "crawlercalm", "img/crawlercalm.png");
    new ImageAsset(this, "crawlermad", "img/crawlermad.png");
    new ImageAsset(this, "rockbroken1", "img/bluerockbroken1.png");
    new ImageAsset(this, "rockbroken2", "img/bluerockbroken2.png");
    new ImageAsset(this, "speedstone", "img/boots.png");
    new ImageAsset(this, "strengthstone", "img/gauntlet.png");
    new ImageAsset(this, "heart", "img/heart.png");
    new ImageAsset(this, "gate", "img/gate.png");
    new ImageAsset(this, "gatekeeper", "img/gatekeeper.png");
    new ImageAsset(this, "firesmall", "img/firesmall.png");
    new ImageAsset(this, "firemedium", "img/firemedium.png");
    new ImageAsset(this, "firebig", "img/firebig.png");
    this.imagePacks["monk"] = [];
    new ImageAsset(this, "monkleft", "img/monkleft.png", "monk");
    new ImageAsset(this, "monkright", "img/monkright.png", "monk");
    new ImageAsset(this, "holder", "img/holder.png");
    new ImageAsset(this, "square", "img/square.png");
    new ImageAsset(this, "swarm", "img/swarm.png");
    new ImageAsset(this, "mushrooms", "img/mushrooms.png");
    new ImageAsset(this, "slime", "img/ectoplasm.png");
    new ImageAsset(this, "shadow", "img/shadow.png");
    this.imagePacks["moonground"] = [];
    new ImageAsset(this, "moonground1", "img/moon1.png", "moonground");
  }
  getImage(name){
    if(name in this.images)
      return this.images[name].image;
    else {
      console.log(name + " is not in images");
      return false;
    }
  }
  getImagePack(name){
    if(name in this.imagePacks){
      var images = [];
      for(var imageAsset of this.imagePacks[name]){
        images.push(imageAsset.image);
      }
      return images;
    }
    else{
      console.log(name + " is not in image packs");
      return false;
    }
  }
  doneLoading(){
    for(var id in this.images){
      if(!this.images[id])
        return false;
    }
    return true;
  }
  loadImages(){
    for(var id in this.images){
      this.images[id].image = new Image();
      var image = this.images[id].image;
      image.onload = function(){
        image.hasLoaded = true;
      };
      image.src = this.images[id].file;
    }
  }
  onLoad(func){
    while(!this.doneLoading()){}
    func();
  }
}

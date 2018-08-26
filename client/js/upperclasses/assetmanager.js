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
    new ImageAsset(this, "quarryground1", "client/img/quarryground1.png", "quarryground");
    new ImageAsset(this, "quarryground2", "client/img/quarryground2.png", "quarryground");
    new ImageAsset(this, "quarryground3", "client/img/quarryground3.png", "quarryground");
    new ImageAsset(this, "quarryground4", "client/img/quarryground4.png", "quarryground");
    this.imagePacks["ground"] = [];
    new ImageAsset(this, "ground1", "client/img/wall1.png", "ground");
    new ImageAsset(this, "ground2", "client/img/wall2.png", "ground");
    new ImageAsset(this, "ground3", "client/img/wall3.png", "ground");
    new ImageAsset(this, "ground4", "client/img/wall4.png", "ground");
    this.imagePacks["homeground"] = [];
    new ImageAsset(this, "homeground1", "client/img/blueground1.png", "homeground");
    new ImageAsset(this, "homeground2", "client/img/blueground2.png", "homeground");
    new ImageAsset(this, "homeground3", "client/img/blueground3.png", "homeground");
    new ImageAsset(this, "homeground4", "client/img/blueground4.png", "homeground");
    this.imagePacks["oasisground"] = [];
    new ImageAsset(this, "oasisground1", "client/img/oasis1.png", "oasisground");
    new ImageAsset(this, "oasisground2", "client/img/oasis2.png", "oasisground");
    new ImageAsset(this, "oasisground3", "client/img/oasis3.png", "oasisground");
    new ImageAsset(this, "oasisground4", "client/img/oasis4.png", "oasisground");
    this.imagePacks["greenground"] = [];
    new ImageAsset(this, "greenground1", "client/img/greenground1.png", "greenground");
    new ImageAsset(this, "greenground2", "client/img/greenground2.png", "greenground");
    new ImageAsset(this, "greenground3", "client/img/greenground3.png", "greenground");
    new ImageAsset(this, "greenground4", "client/img/greenground4.png", "greenground");
    this.imagePacks["waterground"] = [];
    new ImageAsset(this, "waterground1", "client/img/waterground1.png", "waterground");
    new ImageAsset(this, "waterground2", "client/img/waterground2.png", "waterground");
    new ImageAsset(this, "waterground3", "client/img/waterground3.png", "waterground");
    new ImageAsset(this, "waterground4", "client/img/waterground4.png", "waterground");
    this.imagePacks["lightground"] = [];
    new ImageAsset(this, "lightground1", "client/img/light1.png", "lightground");
    new ImageAsset(this, "lightground2", "client/img/light2.png", "lightground");
    new ImageAsset(this, "lightground3", "client/img/light3.png", "lightground");
    new ImageAsset(this, "lightground4", "client/img/light4.png", "lightground");
    this.imagePacks["darkground"] = [];
    new ImageAsset(this, "darkground1", "client/img/dark1.png", "darkground");
    new ImageAsset(this, "darkground2", "client/img/dark2.png", "darkground");
    new ImageAsset(this, "darkground3", "client/img/dark3.png", "darkground");
    new ImageAsset(this, "darkground4", "client/img/dark4.png", "darkground");
    this.imagePacks["blueground"] = [];
    new ImageAsset(this, "blueground1", "client/img/blueground1.png", "blueground");
    new ImageAsset(this, "blueground2", "client/img/blueground2.png", "blueground");
    new ImageAsset(this, "blueground3", "client/img/blueground3.png", "blueground");
    new ImageAsset(this, "blueground4", "client/img/blueground4.png", "blueground");
    this.imagePacks["dirtground"] = [];
    new ImageAsset(this, "dirtground1", "client/img/dirtground1.png", "dirtground");
    new ImageAsset(this, "dirtground2", "client/img/dirtground2.png", "dirtground");
    new ImageAsset(this, "dirtground3", "client/img/dirtground3.png", "dirtground");
    new ImageAsset(this, "dirtground4", "client/img/dirtground4.png", "dirtground");
    this.imagePacks["rockground"] = [];
    new ImageAsset(this, "rockground1", "client/img/rockground1.png", "rockground");
    new ImageAsset(this, "rockground2", "client/img/rockground2.png", "rockground");
    new ImageAsset(this, "rockground3", "client/img/rockground3.png", "rockground");
    new ImageAsset(this, "rockground4", "client/img/rockground4.png", "rockground");
    new ImageAsset(this, "rockground5", "client/img/rockground5.png", "rockground");
    new ImageAsset(this, "rockground6", "client/img/rockground6.png", "rockground");
    new ImageAsset(this, "rockground7", "client/img/rockground7.png", "rockground");
    new ImageAsset(this, "rockground8", "client/img/rockground8.png", "rockground");
    this.imagePacks["brownground"] = [];
    new ImageAsset(this, "brownground1", "client/img/brownground1.png", "brownground");
    new ImageAsset(this, "brownground2", "client/img/brownground2.png", "brownground");
    new ImageAsset(this, "brownground3", "client/img/brownground3.png", "brownground");
    new ImageAsset(this, "brownground4", "client/img/brownground4.png", "brownground");
    new ImageAsset(this, "groundoutline", "client/img/groundoutline.png");
    this.imagePacks["flowers"] = [];
    new ImageAsset(this, "redflower", "client/img/redflower.png", "flowers");
    new ImageAsset(this, "blueflower", "client/img/blueflower.png", "flowers");
    new ImageAsset(this, "purpleflower", "client/img/purpleflower.png", "flowers");
    new ImageAsset(this, "yellowflower", "client/img/yellowflower.png", "flowers");
    new ImageAsset(this, "whiteflower", "client/img/whiteflower.png", "flowers");
    new ImageAsset(this, "flowerflat", "client/img/flowerflat.png");
    new ImageAsset(this, "greengem", "client/img/greengem.png");
    new ImageAsset(this, "fuel", "client/img/stick.png");
    new ImageAsset(this, "wing", "client/img/wing.png");
    new ImageAsset(this, "coinbronze", "client/img/coinbronze.png");
    new ImageAsset(this, "coinsilver", "client/img/coinsilver.png");
    new ImageAsset(this, "coingold", "client/img/coingold.png");
    new ImageAsset(this, "tradebubble", "client/img/tradebubble.png");
    new ImageAsset(this, "tradebubblebig", "client/img/tradebubblebig.png");
    this.imagePacks["ghost"] = [];
    new ImageAsset(this, "ghostleft", "client/img/ghostleft.png", "ghost");
    new ImageAsset(this, "ghostright", "client/img/ghostright.png", "ghost");
    new ImageAsset(this, "ghosthurtleft", "client/img/ghosthurtleft.png", "ghost");
    new ImageAsset(this, "ghosthurtright", "client/img/ghosthurtright.png", "ghost");
    new ImageAsset(this, "rock", "client/img/bluerock.png");
    new ImageAsset(this, "playerwalking", "client/img/playerwalking.png");
    new ImageAsset(this, "player", "client/img/player.png");
    new ImageAsset(this, "bat", "client/img/bat.png");
    new ImageAsset(this, "fountain", "client/img/fountain.png");
    new ImageAsset(this, "barrel", "client/img/barrel.png");
    new ImageAsset(this, "column", "client/img/column.png");
    new ImageAsset(this, "bonestick", "client/img/bonecollection.png");
    new ImageAsset(this, "graveleft", "client/img/graveleft.png");
    new ImageAsset(this, "graveright", "client/img/graveright.png");
    new ImageAsset(this, "bear", "client/img/bearcape.png");
    new ImageAsset(this, "bibfaded", "client/img/bibfaded.png");
    new ImageAsset(this, "bibempty", "client/img/bibempty.png");
    new ImageAsset(this, "bibred", "client/img/bibred.png");
    new ImageAsset(this, "rockoutlinefull", "client/img/rockoutlinefull.png");
    new ImageAsset(this, "rockoutlineempty", "client/img/rockoutlineempty.png");
    new ImageAsset(this, "fueloutlinefull", "client/img/fueloutlinefull.png");
    new ImageAsset(this, "fueloutlineempty", "client/img/fueloutlineempty.png");
    new ImageAsset(this, "invoutlinefull", "client/img/invoutlinefull.png");
    new ImageAsset(this, "invoutlineempty", "client/img/invoutlineempty.png");
    new ImageAsset(this, "crawlercalm", "client/img/crawlercalm.png");
    new ImageAsset(this, "crawlermad", "client/img/crawlermad.png");
    new ImageAsset(this, "rockbroken1", "client/img/bluerockbroken1.png");
    new ImageAsset(this, "rockbroken2", "client/img/bluerockbroken2.png");
    new ImageAsset(this, "speedstone", "client/img/boots.png");
    new ImageAsset(this, "strengthstone", "client/img/gauntlet.png");
    new ImageAsset(this, "heart", "client/img/heart.png");
    new ImageAsset(this, "gate", "client/img/gate.png");
    new ImageAsset(this, "gatekeeper", "client/img/gatekeeper.png");
    new ImageAsset(this, "firesmall", "client/img/firesmall.png");
    new ImageAsset(this, "firemedium", "client/img/firemedium.png");
    new ImageAsset(this, "firebig", "client/img/firebig.png");
    this.imagePacks["monk"] = [];
    new ImageAsset(this, "monkleft", "client/img/monkleft.png", "monk");
    new ImageAsset(this, "monkright", "client/img/monkright.png", "monk");
    new ImageAsset(this, "holder", "client/img/holder.png");
    new ImageAsset(this, "square", "client/img/square.png");
    new ImageAsset(this, "swarm", "client/img/swarm.png");
    new ImageAsset(this, "mushrooms", "client/img/mushrooms.png");
    new ImageAsset(this, "slime", "client/img/ectoplasm.png");
    new ImageAsset(this, "shadow", "client/img/shadow.png");
    this.imagePacks["moonground"] = [];
    new ImageAsset(this, "moonground1", "client/img/moon1.png", "moonground");
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

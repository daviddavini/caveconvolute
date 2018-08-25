class StrandMap extends CaveMap{
  constructor(cave, numbOfPlugs, numbOfOutlets){
    var groundImagess = [assetManager.getImagePack("darkground"),
                        assetManager.getImagePack("greenground"),
                        assetManager.getImagePack("brownground"),
                        assetManager.getImagePack("blueground")];
    var groundImages = assetManager.getImagePack("brownground");//groundImagess[StrandMap.number%groundImagess.length];
    StrandMap.number++;
    super(cave, groundImages, numbOfPlugs, numbOfOutlets)
    this.walker = new Walker({maxAngleAcc:Math.PI*0.01, maxAngleChange:Math.PI*0.013},
                          {maxAngleAcc:Math.PI*0.15, maxAngleChange:Math.PI*0.12}, cave);
    this.walker.makePath(1, numbOfPlugs, numbOfOutlets); //100, 3, 3
    this.retrieveWalkerInfo();
    this.growPlan = [];
    for(var i = 0; i < randInt(3,5); i++){
      this.growPlan.push([0.3, 0.14]);
    }
    this.floor = this.doGrowsOn(this.floor, this.growPlan);
    super.chooseFloorImages();
    this.createBarrierBoxes();
  }
  retrieveWalkerInfo(){
    var walkerInfo = this.walker.getArrayInfo();
    this.floor = walkerInfo.floor;
    this.connectors = walkerInfo.connectors;
    this.freeOutlets = walkerInfo.freeOutlets;
    this.width = walkerInfo.width;
    this.height = walkerInfo.height;
    this.centralPath = walkerInfo.centralPath;
    this.keyAreas = walkerInfo.fatAreas;
  }
  useRandomKeyArea(){
    var k = randPop(this.keyAreas);
    return k;
  }
}
StrandMap.number = 0;

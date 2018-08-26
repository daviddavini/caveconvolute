class Categorized {
  //trusting that the sorted objects have an id property
  constructor(things){
    if(!things){
      things = [];
    }
    this.thingsToCategories = {};
    this.categories = {all: []};
    for(var thing of things)
      this.add(thing);
  }
  add(thing){
    if(!this.categories.all.includes(thing)){
      this.categories.all.push(thing);
      this.thingsToCategories[thing.id] = ["all"];
    }
  }
  addToCategory(thing, cat){
    this.add(thing);
    if(!this.categories.hasOwnProperty(cat)){
      this.categories[cat] = [];
    }
    if(!this.categories[cat].includes(thing)){
      this.categories[cat].push(thing);
      this.thingsToCategories[thing.id].push(cat);
    }
  }
  checkInCat(thing, cat){
    return this.thingsToCategories[thing.id].includes(cat);
  }
  get(cat){
    if(cat){
      if(!this.categories.hasOwnProperty(cat)){
        this.categories[cat] = [];
      }
      return this.categories[cat];
    }
    return this.categories.all;
  }
  removeFromCategory(thing, cat){
    if(this.categories[cat].includes(thing)){
      this.categories[cat].splice( this.categories[cat].indexOf(thing), 1 );
      this.thingsToCategories[thing.id].splice( this.thingsToCategories[thing.id].indexOf(cat), 1 );
    }
  }
  remove(thing){
    for(var cat of this.thingsToCategories[thing.id]){
      this.categories[cat].splice( this.categories[cat].indexOf(thing), 1 );
    }
    delete this.thingsToCategories[thing.id];
  }
}

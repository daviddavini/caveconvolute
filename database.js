var USE_DB = true;

var mongojs = USE_DB ? require('mongojs') : null;
var db = USE_DB ? mongojs(process.env.MONGODB_URI, ['account', 'progress']) : null;

Database = {};

///////
Database.loadAccount = function(data, cb){
  if(!USE_DB){
    return cb({success:true, playerInfo:0});
  }
  db.account.findOne({username:data.username, password:data.password}, function(err, res){
    if(res){
      cb({success:true, playerInfo:res.playerInfo, test:res.test});
    } else{
      cb({success:false, reason:"nonexistant"});
    }
  });
}

Database.isExistingAccount = function(data, cb){
  if(!USE_DB){
    return cb({success:data.username === "david" && data.password === "davini"});
  }
  db.account.findOne({username:data.username}, function(err, res){
    if(res){
      cb({success:true});
    } else{
      cb({success:false, reason:"nonexistant"});
    }
  });
}

Database.createAccount = function(data, cb){
  Database.isExistingAccount(data, function(data){
    if(data.success)
      return cb({success:false, reason:"duplicate"});
  });
  if(!USE_DB){
    return cb({success:data.username === "david" && data.password === "davini"});
  }
  if(!(data.username.length > 0 && data.password.length > 0))
    return cb({success:false, reason:"empty"});
  var test = {hello:"hi", game:[1,2,3]};
  db.account.insert({username:data.username, password:data.password, test:test}, function(err){
    //save user progress too...
    cb({success:true});
  });
}

Database.saveUserProgress = function(data, cb){
  cb = cb || function(){}; //optional callback
  if(!USE_DB){
    return cb();
  }
  db.account.update({username:'b'}, data, cb);
}

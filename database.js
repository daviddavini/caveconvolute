var USE_DB = true;

var mongojs = USE_DB ? require('mongojs') : null;
var db = USE_DB ? mongojs(process.env.MONGODB_URI, ['account', 'progress']) : null;

Database = {};

///////
Database.saveAccount = function(data, cb){
  if(!USE_DB){
    return cb({success:true});
  }
  db.account.findOne({username:data.username, password:data.password}, function(err, res){
    if(res){
      db.account.update({_id:res._id}, {$set:{playerInfo:data.playerInfo, explorerInfo:data.explorerInfo}}, {}, function(err){
        cb({success:true});
      });
    } else{
      cb({success:false, reason:"nonexistant"});
    }
  });
}

Database.loadAccount = function(data, cb){
  if(!USE_DB){
    return cb({success:true, explorerInfo:{name:"david", code:"davini"}});
  }
  if(!(data.username.length > 0 && data.password.length > 0)){
    return cb({success:false, reason:"empty"});
  }
  Database.isExistingAccount(data, function(data){
    if(data.success){
      db.account.findOne({username:data.username, password:data.password}, function(err, res){
        if(res){
          cb({success:true, playerInfo:res.playerInfo, explorerInfo:res.explorerInfo});
        } else{
          cb({success:false, reason:"notmatching"});
        }
      });
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
  if(!USE_DB){
    return cb({success:data.username === "david" && data.password === "davini"});
  }
  if(!(data.username.length > 0 && data.password.length > 0)){
    return cb({success:false, reason:"empty"});
  }
  Database.isExistingAccount(data, function(data){
    if(data.success){
      cb({success:false, reason:"duplicate"});
    } else{
      db.account.insert({username:data.username, password:data.password}, function(err){
        //save user progress too...
        cb({success:true});
      });
    }
  });
}

Database.saveUserProgress = function(data, cb){
  cb = cb || function(){}; //optional callback
  if(!USE_DB){
    return cb();
  }
  db.account.update({username:'b'}, data, cb);
}

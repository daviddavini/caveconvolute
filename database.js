var USE_DB = true;

var mongojs = USE_DB ? require('mongojs') : null;
var db = USE_DB ? mongojs(MONGODB_URI, ['account', 'progress']) : null;

Database = {};

Database.isValidPassword = function(data, cb){
  if(!USE_DB){
    return cb(true);
  }
  db.account.findOne({username:'b', password:'bb'}, function(err, res){
    if(res){
      console.log("user exists, correct pass");
      cb(true);
    } else{
      cb(false);
    }
  });
}

Database.addUser = function(data, cb){
  if(!USE_DB){
    return cb();
  }
  db.account.insert({username:'b', password:'bb'}, function(err){
    //save user progress too...
    cb();
  });
}

Database.saveUserProgress = function(data, cb){
  cb = cb || function(){}; //optional callback
  if(!USE_DB){
    return cb();
  }
  db.account.update({username:'b'}, data, cb);
}

//var mongojs = require('mongojs');
var db = null;//mongojs('databasefilename', ['account', 'progress']);

// db.account.insert({username:'b', password:'bb'});
// db.account.find({username:'b', password'bb'}, function(err, res){
//   if(res.length > 0){
//     console.log("username exists");
//   }
// });

var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
})
app.use('/client', express.static(__dirname + '/client'));

serv.listen(process.env.PORT || 2000);
console.log("Server started.");

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
  console.log('socket connection');

  socket.on('happy', function(data){
    console.log('im happy', data.reason);
  })
})

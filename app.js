require('./database');

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

  socket.on('createAccount', function(data){
    Database.createAccount(data, function(success){
      socket.emit('createAccountReturn', {success:success});
    });
  })
})

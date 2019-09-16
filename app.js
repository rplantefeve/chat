// pas d'utilisation d'express pour l'instant
var http = require('http');
// accès au système de fichiers
var fs = require('fs');

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
  // A chque requête d'un client, on renvoit index.html
  fs.readFile('./index.html', 'utf-8', function(error, content) {
    res.writeHead(200, {
      "Content-Type": "text/html"
    });
    res.end(content);
  });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function(socket) {
  console.log('Un client est connecté !');
});

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function(socket) {
  socket.emit('message', {content : 'Vous êtes bien connecté !'});
});


server.listen(8080);

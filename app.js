// pas d'utilisation d'express pour l'instant
var http = require('http');
// accès au système de fichiers
var fs = require('fs');

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
  // A chque requête d'un client, on renvoit index.html
  fs.readFile(__dirname + '/index.html', 'utf-8', function(error, content) {
    // si erreur
    if (error) {
      res.writeHead(500, {
        "Content-Type": "text/html"
      });
      return res.end('Erreur au chargement de index.html');
    }
    res.writeHead(200, {
      "Content-Type": "text/html"
    });
    res.end(content);
  });
});

// Chargement de socket.io (équivalent à var io = require('socket.io').listen(server);
var io = require('socket.io')(server);

// Quand un client se connecte, on envoi un message au client
io.on('connection', function(socket) {
  // Quand un client se connecte, on le note dans la console
  console.log('Un client est connecté !');
  // envoi d'un message au client connecté
  socket.emit('fromServer', {
    content: 'Vous êtes bien connecté !'
  });

  // écoute d'un message envoyé par le client
  socket.on('fromClient', function(message) {
    // on le log
    console.log('Message du client ' + message.qui + ' : ' + message.quoi);
    // puis on broadcast à tout le monde (y compris l'expéditeur)
    io.emit('message', message);
  });

  socket.on('initiate', function(userName) {
    socket.userName = userName;
    console.log('Authentification du client : ' + userName);
    // envoi d'un message à tous les autres clients
    socket.broadcast.emit('fromServer', {
      content: userName + ' vient de se connecter !'
    });
  })
});


server.listen(8080);

var path = require('path')
var peer = require('peer')
var express = require('express')

var app = express()

var peers = [];

app.use(express.static('public'))

// GET method route
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
})

app.get('/user/random', function (req, res) {    
    var maxRetries = 12;

    do {
        var randomPeer = peers[Math.floor(Math.random() * peers.length)];
    } while(peers.length > 1 && randomPeer == req.query['except'] && !maxRetries--)
    
    console.log('Random peer: ' + randomPeer)
    res.send(randomPeer);
})

var appServer = app.listen(9000, function () {
    console.log('Server listening on port 9000!');
})


var options = {
    debug: true
}

peerServer = peer.ExpressPeerServer(appServer, options)

peerServer.on('connection', function(id) {
    peers.push(id);
    console.log('--- PEER CONNECTED:', id, '---')
});

peerServer.on('disconnect', function(id) {
    peers.splice(peers.indexOf(id), 1);
    console.log('--- PEER DISCONNECTED:', id, '---')
});

app.use('/peerjs', peerServer);
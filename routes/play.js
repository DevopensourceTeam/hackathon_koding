var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

    var qr = require('qr-image');

    var hash = Math.random().toString(36).slice(-4);

    var hostname = req.headers.host;
    var url = "http://"+hostname+"/play/"+hash;
    var urlct = url+"/ct";

    var qr_png = qr.imageSync(urlct, { type: 'png' });
    var qr_str = "data:image/png;base64," + qr_png.toString('base64');

    /**
     * Listener
     */
    var usernames = {};
    io.sockets.on('connection', function (socket) {

        socket.on('sendcommand', function (data) {
            socket.broadcast.to(socket.room).emit('updatecommand',  socket.username, data);
            socket.emit('updatecommand',  socket.username, data);
        });

        socket.on('sendoption', function (data) {
            console.log(socket.username);
            console.log(data);
            socket.broadcast.to(socket.room).emit('updateoption',  socket.username, data);
        });

        // when the client emits 'adduser', this listens and executes
        socket.on('adduser', function(data){
            socket.username = data.username;
            socket.room = data.room;
            usernames[socket.username] = socket.username;
            socket.join(socket.room);
            socket.emit('updatecommand', 'SERVER', 'you have connected');
            socket.broadcast.to(hash).emit('updatecommand', 'SERVER', socket.username + ' has connected to this room');
            io.sockets.emit('updateusers', usernames);
        });

        socket.on('addmonitor', function(room){
            socket.room = room;
            socket.join(socket.room);
        });

    });

    res.render('play', { title: 'Play', urlct: urlct,url:url ,qr:qr_str,hash:hash});
});


router.get('/:hash/ct', function(req, res, next) {

    var hash = req.params.hash;
    var avatar = Math.floor(Math.random() * 17) + 1;
    res.render('controller', { title: 'Controller', hash: hash, avatar:avatar});
});

router.get('/:hash', function(req, res, next) {
    var hash = req.params.hash;
    res.render('monitor', { title: 'Play', hash: hash});
});

module.exports = router;

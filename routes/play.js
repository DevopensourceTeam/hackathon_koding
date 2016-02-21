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
    var countUsers = 0;
    io.sockets.on('connection', function (socket) {

        console.log('SCK: listen connection event (ruta /)');

        socket.on('sendcommand', function (data) {
            console.log('SCK: event sendcommand');

            socket.broadcast.to(socket.room).emit('updatecommand',  socket.username, data);
            socket.emit('updatecommand',  socket.username, data);
        });

        socket.on('sendoption', function (data) {

            // Validation room
            if(socket.room != hash){
                return false;
            }

            console.log('SCK: event sendoption');
            console.log(socket.username);
            console.log(data);
            console.log(socket.room);
            socket.broadcast.to(socket.room).emit('updateoption',  socket.username, data);
        });

        // Send answers to gamer
        socket.on('sendanswers', function (data) {

            // Validation room
            if(socket.room != hash){
                return false;
            }

            console.log(data);
            socket.broadcast.to(socket.room).emit('getOptionValues', data);
        });

        // when the client emits 'adduser', this listens and executes
        socket.on('adduser', function(data){
            console.log('SCK: event adduser');
            console.log('SCK: connect user');
            console.log(data);

            // vars
            socket.username             = data.username;
            socket.room                 = data.room;
            usernames[socket.username]  = {avatar:data.avatar,username:socket.username};

            console.log(usernames);

            // join user to room
            socket.join(socket.room);
            socket.emit('updatecommand', 'SERVER', 'you have connected');
            socket.broadcast.to(hash).emit('updatecommand', 'SERVER', socket.username + ' has connected to this room');

            io.sockets.emit('updateusers', usernames);

            console.log('num users: '+countUsers);

            // Count total users
            countUsers++;

            // If one user enable play
            if(countUsers == 1){
                io.sockets.emit('enableplay', true);
            }
        });

        socket.on('addmonitor', function(room){
            socket.room = room;
            socket.join(socket.room);
        });

    });

    res.render('play', { title: 'Play', urlct: urlct,url:url ,qr:qr_str,hash:hash});
});


router.get('/:hash/ct', function(req, res, next) {
    console.log('Ruta controller');
    var hash = req.params.hash;
    var avatar = Math.floor(Math.random() * 17) + 1;
    res.render('controller', { title: 'Controller', hash: hash, avatar:avatar});
});

router.get('/:hash', function(req, res, next) {
    var hash = req.params.hash;
    var path = require('path');
    var json = JSON.parse(require('fs').readFileSync(path.join(__dirname,'..', 'questions/questions.json'), 'utf8'));
    var questions = json.questions;
    questions = shuffle(questions);
    questions = questions.slice(0, 5);
    res.render('monitor', { title: 'Play', hash: hash, questions:questions});
});

function shuffle(o) {
    var j, x, i;
    for (i = o.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = o[i-1];
        o[i-1] = o[j];
        o[j] = x;
    }

    return o;
}

module.exports = router;

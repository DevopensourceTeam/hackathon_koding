var express = require('express');
var router = express.Router();

// Route /play
router.get('/', function(req, res, next) {

    var qr = require('qr-image');

    var hash = Math.random().toString(36).slice(-4);
    
    hash.toLowerCase();


    var hostname = req.headers.host;
    var url = "http://"+hostname+"/play/"+hash;
    var urlct = "http://"+hostname+"/play/ct/"+hash;
    var qr_png = qr.imageSync(urlct, { type: 'png' });
    var qr_str = "data:image/png;base64," + qr_png.toString('base64');

    /**
     * Listener
     */
    var usernames = {};
    var countUsers = 0;

    var punctuation = {};

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

          //   console.log("punctuation process");
          //   console.log(socket.username);
          //
          //
          //
          //   punctuation[socket.username] = 100;
          //   socket.username['punctuation'] = 100;
          //
          //   console.log(punctuation);
          //
          //   console.log(socket.username.punctuation);

            console.log('SCK: event sendoption');
            console.log(socket.username);
            console.log(data);
            console.log(socket.room);
            socket.broadcast.to(socket.room).emit('updateoption',  socket.username, data);
        });

        socket.on('sendpoints', function (data) {

            console.log("receive points");

            // Validation room
            if(socket.room != hash){
                return false;
            }

            console.log(data);

            var username  = data.username;
            var points    = data.points;

            console.log(username);
            console.log(points);
            console.log("punctuation process");

            if(data.reduce){

                console.log("reduce points to"+ username);

                if (isNaN(punctuation[username])) {
                    console.log("is nan");
                    punctuation[username] = 0;
                }else if(parseInt(points) >= parseInt(punctuation[username]) ){
                    console.log("major than points current");
                    punctuation[username] = 0;
                }else{
                    console.log("reduce points");
                    punctuation[username] = punctuation[username] - points;
                }

            }else {
                punctuation[username] = points;
            }

            //socket.username['punctuation']  = points;
            //  console.log(socket.username.punctuation);

            console.log(punctuation);

            console.log('SCK: event sendpoints');

            console.log(data);

            //socket.broadcast.to(socket.room).emit('updateoption',  socket.username, data);
        });

        // Send points to monitor
        socket.on('getpoints', function (data) {

            // Validation room
            if(socket.room != hash){
                return false;
            }

            console.log(data);
            socket.broadcast.to(socket.room).emit('updatepoints', {'punctuation':punctuation});
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

            // Count total users
            countUsers++;

            console.log('num users: '+countUsers);

            // If one user enable play
            if(countUsers == 1){
                io.sockets.emit('enableplay', true);
            }
        });

        socket.on('addmonitor', function(room){

            console.log('SCK: listen connection event :addmonitor');

            socket.room         = room;
            socket.punctuation  = {};

            console.log(socket.punctuation);

            socket.join(socket.room);
        });

        socket.on('lockallcontroller', function(value){
            socket.broadcast.to(socket.room).emit('lockcontroller', value);
        });

    });

    res.render('play', { title: 'Play', urlct: urlct,url:url ,qr:qr_str,hash:hash});
});

// Route /play/ct/ia4i
router.get('/ct/:hash', function(req, res, next) {
    console.log('Route controller');
    var hash = req.params.hash;
    hash.toLowerCase();


    if(req.cookies.avatar){
        var avatar = req.cookies.avatar
    }else{
        var avatar = Math.floor(Math.random() * 17) + 1;
    }

    res.render('controller', { title: 'Controller', hash: hash, avatar:avatar});
});

// Route /play/ia4i
router.get('/:hash', function(req, res, next) {
    console.log('Monitor controller');
    var hash = req.params.hash;
    hash.toLowerCase();

    var path = require('path');
    var json = JSON.parse(require('fs').readFileSync(path.join(__dirname,'..', 'questions/questions.json'), 'utf8'));
    var questions = json.questions;
    questions = shuffle(questions);
    questions = questions.slice(0, 10);
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

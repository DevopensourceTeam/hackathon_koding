var express = require('express');
var router = express.Router();

// Route /game-quizz
router.get('/', function(req, res, next) {

    var qr = require('qr-image');
    var hash = Math.random().toString(36).slice(-4);
    hash.toLowerCase();

    var hostname = req.headers.host;
    var domainurl = "http://"+hostname+"/";
    var url = "http://"+hostname+"/game-quizz/"+hash;
    var urlct = "http://"+hostname+"/game-quizz/ct/"+hash;
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
        socket.on('sendoption', function (data) {
            if(socket.room != hash){
                return false;
            }

            console.log('SCK: event sendoption');
            console.log(socket.username);
            console.log(data);
            console.log(socket.room);
            socket.broadcast.to(socket.room).emit('updateoption',  socket.username, data);
        });

        socket.on('sendpoints', function (data) {
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

                socket.broadcast.to(socket.room).emit('pointsresult', {points:-points,username:username});


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
              socket.broadcast.to(socket.room).emit('pointsresult', {points:points,username:username});
              if(isNaN(punctuation[username])){
                punctuation[username] = points;
              }else{
                punctuation[username] = parseInt(punctuation[username] + points);
              }

            }

            console.log(punctuation);
            console.log('SCK: event sendpoints');
            console.log(data);
        });

        // Send points to monitor
        socket.on('getpoints', function (data) {
            if(socket.room != hash){
                return false;
            }

            console.log(data);
            socket.broadcast.to(socket.room).emit('updatepoints', {'punctuation':punctuation});
        });

        // Send answers to gamer
        socket.on('sendanswers', function (data) {
            if(socket.room != hash){
                return false;
            }

            console.log(data);
            socket.broadcast.to(socket.room).emit('getOptionValues', data);
        });

        // when the client emits 'adduser', this listens and executes
        socket.on('adduser', function(data){
            if(data.room != hash){
                return false;
            }

            console.log('SCK: event adduser');
            console.log('SCK: connect user');
            console.log(data);

            socket.username             = data.username;
            socket.room                 = data.room;
            usernames[socket.username]  = {avatar:data.avatar, username:socket.username};

            console.log(usernames);

            socket.join(socket.room);
            socket.emit('updatecommand', 'SERVER', 'you have connected');
            socket.broadcast.to(hash).emit('updatecommand', 'SERVER', socket.username + ' has connected to this room');

            io.sockets.to(socket.room).emit('updateusers', usernames);

            // Count total users
            countUsers++;
            console.log('num users: '+countUsers);

            // If one user enable play
            if(countUsers == 1){
                io.sockets.to(socket.room).emit('enableplay', true);
            }
        });

        socket.on('newsession', function(room){
            if(room != hash){
                return false;
            }

            socket.join(room);
        });

        socket.on('addmonitor', function(room){
            if(room != hash){
                return false;
            }

            console.log('SCK: listen connection event :addmonitor');

            socket.room         = room;
            socket.punctuation  = {};

            console.log(socket.punctuation);

            socket.join(socket.room);
        });

        socket.on('lockallcontroller', function(value){
            if(socket.room != hash){
                return false;
            }

            socket.broadcast.to(socket.room).emit('lockcontroller', value);
        });

        socket.on('endgame', function(value){
            if(socket.room != hash){
                return false;
            }

            console.log("SERVER: end game");
            socket.emit('finalizemonitor', {'punctuation':punctuation});
            socket.broadcast.to(socket.room).emit('endgame', value);

        });
    });

    res.render('gamequizz', { title: 'Game Quizz', urlct: urlct,url:url ,qr:qr_str,hash:hash,domainurl:domainurl});
});

// Route /game-quizz/ct/:hash
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

// Route /game-quizz/:hash
router.get('/:hash', function(req, res, next) {

    console.log('Monitor controller');

    var hash = req.params.hash;

    hash.toLowerCase();

    console.log('clean punctuation');
    punctuation = {};
    io.sockets.emit('updatepoints', {'punctuation':punctuation});

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

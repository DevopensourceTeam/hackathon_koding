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

    res.render('play', { title: 'Play', urlct: urlct,url:url ,qr:qr_str });
});


router.get('/:hash/ct', function(req, res, next) {

    var hash = req.params.hash;

    res.render('controller', { title: 'Controller', hash: hash});
});

router.get('/:hash', function(req, res, next) {
    var hash = req.params.hash;

    console.log(hash);

    /**
     * Listener
     */
    io.on('connection', function (socket) {

        console.log('created monitor!!!');

      socket.emit('news', { hello: 'world' });

      socket.on('my other event', function (data) {
        console.log(data);
      });

      socket.on(hash+'_room', function (data) {
          console.log('user connected!!');
        console.log(data);
      });
    });

      res.render('monitor', { title: 'Play'});
});

module.exports = router;
var express = require('express');
var router = express.Router();

router.get('/play', function(req, res, next) {
    var qr = require('qr-image');

    var hash = Math.random().toString(36).slice(-5);
    var hostname = req.headers.host;
    var url = "http://"+hostname+"/play/"+hash;
    var urlct = url+"/ct";

    var qr_png = qr.imageSync(urlct, { type: 'png' });
    var qr_str = "data:image/png;base64," + qr_png.toString('base64');

    res.render('play', { title: 'Play', urlct: urlct,url:url ,qr:qr_str });
});


router.get('/play/:hash/ct', function(req, res, next) {
    var hash = req.params.hash;
    console.log(hash);
});

router.get('/play/:hash', function(req, res, next) {
    var hash = req.params.hash;
    console.log(hash);
});
module.exports = router;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/play', function(req, res, next) {
    var qr = require('qr-image');

    var hash = Math.random().toString(36).slice(-5);
    var hostname = req.headers.host;
    var url = "http://"+hostname+"/play/"+hash+"/ct";
    var qr_png = qr.imageSync(url, { type: 'png' });
    var qr_str = "data:image/png;base64," + qr_png.toString('base64');

    res.render('play', { title: 'Play', url: url,qr:qr_str });
});


module.exports = router;

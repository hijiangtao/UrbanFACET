var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'LMVC', name: 'index' });
});
/* GET stat page. */
router.get('/stat', function(req, res, next) {
  res.render('stat', { title: 'LMVC', name: 'stat' });
});

module.exports = router;

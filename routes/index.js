var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home', name: 'index' });
});
/* GET stat page. */
router.get('/lab', function(req, res, next) {
  res.render('lab', { title: 'Lab Stats', name: 'lab' });
});

module.exports = router;

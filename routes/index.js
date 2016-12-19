var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'VC Homepage', name: 'index' });
});
/* GET stat page. */
router.get('/lab', function(req, res, next) {
  res.render('lab', { title: 'Lab Stats', name: 'lab' });
});
/* GET ui page. */
router.get('/ui', function(req, res, next) {
  res.render('ui', { title: 'UI Template', name: 'index' });
});

module.exports = router;

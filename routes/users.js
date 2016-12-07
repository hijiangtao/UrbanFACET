var express = require('express');
var router = express.Router();
var userQuery = require('../controllers/apis/userQuery');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/api/v1/ui/q', function(req, res, next) {
  userQuery.queryUserbyID(req, res, next);
});

module.exports = router;

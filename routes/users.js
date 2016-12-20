const express = require('express');
const router = express.Router();
const userQuery = require('../controllers/apis/userQuery');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/api/v1/ui/q', function(req, res, next) {
  userQuery.queryUserbyID(req, res, next);
});

router.post('/api/v1/lab/queryClusterStats', function(req, res, next) {
	userQuery.queryClusterStats(req, res, next);
})

module.exports = router;

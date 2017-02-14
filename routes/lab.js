const express = require('express');
const router = express.Router();
const apis = require('../controllers/apis/lab');

/* GET users listing. */
router.post('/v1/queryClusterStats', function(req, res, next) {
	apis.queryClusterStats(req, res, next);
})

module.exports = router;

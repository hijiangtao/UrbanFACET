const express = require('express');
const router = express.Router();
const lab = require('../controllers/apis/lab');

/* GET users listing. */
router.post('/v1/queryClusterStats', function(req, res, next) {
	lab.queryClusterStats(req, res, next);
})

module.exports = router;

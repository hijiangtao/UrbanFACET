/**
 * comp.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-02-12 16:14:19
 */

const express = require('express');
const router = express.Router();
const apis = require('../controllers/apis/comp');

router.get('/init', function(req, res, next) {
	apis.init(req, res, next);
});

router.get('/overviewQuery', function(req, res, next) {
	apis.overviewQuery(req, res, next);
});
router.get('/overviewDQuery', function(req, res, next) {
	apis.overviewDQuery(req, res, next);
});

module.exports = router;

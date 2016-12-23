/**
 * home.js routes
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2016-12-20 16:29:03
 * @version $Id$
 */

const express = require('express');
const router = express.Router();
const home = require('../controllers/apis/home');

router.get('/v1/tsnetrain', function(req, res, next) {
	home.tsnetrain(req, res, next);
})
router.post('/v1/clustertrain', function(req, res, next) {
	home.clustertrain(req, res, next);
})
router.get('/v1/labeltrain', function(req, res, next) {
	home.labeltrain(req, res, next);
})

module.exports = router;

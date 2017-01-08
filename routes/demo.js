/**
 * demo.js routes
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-01-08 15:40:08
 * @version $Id$
 */

const express = require('express');
const router = express.Router();
const home = require('../controllers/apis/demo');

router.get('/v1/tsnetrain', function(req, res, next) {
	home.tsnetrain(req, res, next);
})
router.post('/v1/clustertrain', function(req, res, next) {
	home.clustertrain(req, res, next);
})
router.get('/v1/labeltrain', function(req, res, next) {
	home.labeltrain(req, res, next);
})
router.post('/v1/vcquery', function(req, res, next) {
	home.vcquery(req, res, next);
})

router.get('/v1/classplot', function(req, res, next) {
	home.classplot(req, res, next);
})
router.get('/v1/madisplay', function(req, res, next) {
	home.madisplayquery(req, res, next);
})

module.exports = router;

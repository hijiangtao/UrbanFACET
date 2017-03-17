/**
 * apis.js routes
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2016-12-20 16:29:03
 * @version $Id$
 */

const express = require('express');
const router = express.Router();
const apis = require('../controllers/apis/home');

router.get('/v1/tsnetrain', function(req, res, next) {
	apis.tsnetrain(req, res, next);
})
router.post('/v1/clustertrain', function(req, res, next) {
	apis.clustertrain(req, res, next);
})
router.get('/v1/labeltrain', function(req, res, next) {
	apis.labeltrain(req, res, next);
})
router.post('/v1/vcquery', function(req, res, next) {
	apis.vcquery(req, res, next);
})

router.get('/v1/classplot', function(req, res, next) {
	apis.classplot(req, res, next);
})
router.get('/v1/madisplay', function(req, res, next) {
	apis.madisplayquery(req, res, next);
})

module.exports = router;

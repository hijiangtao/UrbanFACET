/**
 * demo.js routes
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-01-08 15:40:08
 * @version $Id$
 */

const express = require('express');
const router = express.Router();
const demo = require('../controllers/apis/demo');

router.get('/v1/tsnetrain', function(req, res, next) {
	demo.tsnetrain(req, res, next);
})
router.get('/v1/entropyfilter', function(req, res, next) {
	demo.entropyfilter(req, res, next);
})

router.post('/v1/clustertrain', function(req, res, next) {
	demo.clustertrain(req, res, next);
})
router.get('/v1/labeltrain', function(req, res, next) {
	demo.labeltrain(req, res, next);
})
router.post('/v1/vcquery', function(req, res, next) {
	demo.vcquery(req, res, next);
})

router.get('/v1/classplot', function(req, res, next) {
	demo.classplot(req, res, next);
})
router.get('/v1/madisplay', function(req, res, next) {
	demo.madisplayquery(req, res, next);
})
router.get('/v1/areaentropy', function(req, res, next) {
	demo.areaentropyquery(req, res, next);
})
router.get('/v1/areatprecords', function(req, res, next) {
	demo.areatprecordsquery(req, res, next);
})


module.exports = router;

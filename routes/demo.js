/**
 * apis.js routes
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-01-08 15:40:08
 * @version $Id$
 */

const express = require('express');
const router = express.Router();
const apis = require('../controllers/apis/demo');

router.get('/v1/tsnetrain', function(req, res, next) {
	apis.tsnetrain(req, res, next);
})
router.get('/v1/entropyfilter', function(req, res, next) {
	apis.entropyfilter(req, res, next);
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
router.get('/v1/areaentropy', function(req, res, next) {
	apis.areaentropyquery(req, res, next);
})
router.get('/v1/areatprecords', function(req, res, next) {
	apis.areatprecordsquery(req, res, next);
})


module.exports = router;

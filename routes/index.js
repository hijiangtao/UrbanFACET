const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Urban FACET: Visually Profiling Cities from Mobile Phone Recorded Movement Data of Millions of City Residents', name: 'home' });
});
/* GET demo page. */
// router.get('/demo', function(req, res, next) {
//   res.render('demo', { title: 'DEMO', name: 'demo' });
// });
/* GET comparison page. */
// router.get('/comp', function(req, res, next) {
//   res.render('comp', { title: 'Information-theoretic visual analysis of big urban check-in data', name: 'comp' });
// });

/* GET stats page. */
// router.get('/lab', function(req, res, next) {
//   res.render('lab', { title: 'Lab Stats', name: 'lab' });
// });
/* GET ui page. */
// router.get('/ui', function(req, res, next) {
//   res.render('ui', { title: 'UI Template', name: 'ui' });
// });

module.exports = router;

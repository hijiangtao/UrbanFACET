const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Urban FACET: Visually Profiling Cities from Mobile Phone Recorded Movement Data of Millions of City Residents', name: 'home' });
});

module.exports = router;

const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('home', {
    title: 'UrbanFACET: A Multifaceted City Panorama By Large-Scale Human Mobility Analysis',
    name: 'home'
  });
});

module.exports = router;
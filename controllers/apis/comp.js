/**
 * comp.js apis
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-02-12 16:22:08
 * @version $Id$
 */

'use strict'
const lib = require('../../conf/lib');
const DATA = require('../../conf/data');
const EP = require('../../conf/entropy');

let apis = {
	'overviewQuery': function(req, res, next) {
		let params = req.query;
		console.info('Going to connect MySQL.');
		lib.connectMySQL().then(function(conn) {
			console.info('Got data from MySQL.');
			return EP.getOverview(conn, params)
		}, function(err) {
			console.error('error: ', err);
		}).catch(function(error) {
			console.error('error: ', err);
		}).then(function(result) {
			console.info('Ready to send back result.');
			res.json(result);
		})
	},
	'getTmpFile': function(req, res, next) {
		let params = req.query;
	}
}

module.exports = apis

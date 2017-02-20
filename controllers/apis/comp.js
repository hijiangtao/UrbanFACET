/**
 * comp.js apis
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-02-12 16:22:08
 * @version $Id$
 */

'use strict'
const lib = require('../../conf/lib');
const DATA = require('../../conf/data');
let EP = require('../../conf/entropy');

let apis = {
	'overviewQuery': function(req, res, next) {
		let params = req.query,
			etype = params.etype,
			mtype = params.mtype,
			ctype = params.ctype,
			city = params.city

		lib.connectMySQL().then(function(conn) {
			return EP.getEntropy(conn, params)
		}, function(err) {
			console.error('error: ', err)
		}).catch(function(error) {
			console.log(error);
		}).then(function(result) {
			res.json(result)
		})
	},
	'overviewDQuery': function(req, res, next) {
		let params = req.query;
			// etype = params.etype,
			// emin = params.emin,
			// emax = params.emax,
			// ctype = params.ctype,
			// city = params.city

		lib.connectMySQL().then(function(conn) {
			return EP.getDensity(conn, params)
		}, function(err) {
			console.error('error occured in overviewDQuery: ', err)
		}).catch(function(error) {
			console.error(error);
		}).then(function(result) {
			res.json(result)
		})
	}
}

module.exports = apis

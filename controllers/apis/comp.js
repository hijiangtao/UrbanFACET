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
			type = params.etype,
			emin = params.emin,
			emax = params.emax,
			calculation = 'p',
			city = params.city

		let prop = {
			'city': city,
			'calculation': calculation,
			'type': DATA.getEntropyType(type),
			'emin': emin,
			'emax': emax
		}

		lib.connectMySQL().then(function(conn) {
			return EP.getEntropy(conn, prop)
		}, function(err) {
			console.error('error: ', err)
		}).catch(function(error) {
			console.log(error);
		}).then(function(result) {
			res.json(result)
		})
	}
}

module.exports = apis

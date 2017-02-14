/**
 * comp.js apis
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-02-12 16:22:08
 * @version $Id$
 */

'use strict'
const lib = require('../../conf/lib');
let EP = require('../../conf/entropy');

let apis = {
	'overviewQuery': function(req, res, next) {
		let params = req.query,
			type = params.type,
			city = params.city

		lib.connectMySQL().then(function(conn) {
			return EP.getEntropy(conn, city, type)
		}, function(err) {
			console.error('error: ', err)
		}).catch(function(error) {
			console.log(error);
		}).then(function(result) {
			res.json({
				'scode': 1,
				'data': result
			})
		})
	}
}

module.exports = apis

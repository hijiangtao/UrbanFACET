/**
 * index.js in apis
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2016-12-20 16:22:50
 * @version $Id$
 */
'use strict'

let mongodb = require('mongodb');
let MongoClient = mongodb.MongoClient;
let url = 'mongodb://192.168.1.42:27017/tdVC';

const lib = require('../../conf/lib');
const path = require('path');
const DATA = require('../../conf/data')

let home = {
	tsnetrain(req, res, next) {
		let params = req.query,
			region = params.region,
			feature = params.feature,
			srate = params.srate;

		let file = `2D-ScatterData_1-in-${srate}_tsne-${DATA.getValue(feature, 'feature')}.csv`
		console.log(path.join('/home/joe/Documents/git/living-modes-visual-comparison/server/data', file))
		if (lib.checkDirectory( path.join('/home/joe/Documents/git/living-modes-visual-comparison/server/data', file) )) {
			res.json({'scode': 1})
		} else {
			res.json({'scode': 0})
		}
	}
}

module.exports = home
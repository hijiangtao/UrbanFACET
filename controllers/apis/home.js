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

const execSync = require('child_process').execSync;
const shell = require('shelljs');

let home = {
	/**
	 * [tsnetrain description]
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
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
	},
	/**
	 * [clustertrain description]
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	clustertrain(req, res, next) {
		let params = req.body,
			eps = params.eps,
			minpts = params.minpts,
			pkg = JSON.parse(params['pkg']),
			region = params.region,
			feature = params.feature,
			srate = params.srate;

		let ftypestr = DATA.getValue(feature, 'feature'),
			inpfile = `1-in-${srate}_tsne-${ftypestr}`, 
			oupfile = `DBScanCluster-1-in-${srate}_tsne-${ftypestr}(eps=${eps},minpts=${minpts}).csv`,
			scriptdic = '/home/joe/Documents/git/living-modes-visual-comparison/server/scripts/',
			datadic = '/home/joe/Documents/git/living-modes-visual-comparison/server/data'

		let clsrun;

		if ( lib.checkDirectory( path.join(datadic, oupfile) ) ) {
			console.log('I am already exist.')
			res.json({'scode': 1, 'filename': datadic+oupfile})
		} else {
			clsrun = shell.exec(`cd ${scriptdic} && python ./ClusterUser.py -d ${datadic} -f ${inpfile} -x ${eps} -y ${minpts}`).stdout;
			res.json({'scode': 1, 'filename': clsrun})
		}		
	}
}

module.exports = home
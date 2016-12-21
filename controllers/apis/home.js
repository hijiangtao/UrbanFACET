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

let mongoCallback = function (err, result) {
	if (err) {
		console.log(err);
	} else if (result.length) {
		let resdata =[], recnumdata = []; // 存的所有人 matrix 集合加和

		for (let i = 0; i < result.length; i++) {
			if (i == 0) {
				resdata = lib.MatrixAdd(result[i]['pVec'], result[i]['pVec'], 0.5, 2)
				recnumdata = result[i]['tpNumVec']	
			} else {
				resdata = lib.MatrixAdd(result[i]['pVec'], resdata, 1, 2)
				recnumdata = lib.MatrixAdd(recnumdata, result[i]['tpNumVec'], 1, 1)
			}
		}

		res.send({
			'matrixdata': resdata,
			'recnumdata': recnumdata
		});
	} else {
		console.log('No document(s) found with defined "find" criteria!');
	}

	//Close connection
	db.close();
}

let recomdCal = function(dir, file) {
	let data = {}

	fs.readFile(path.join(dir, file), readfileCallback);

	function readfileCallback(err, data) {
		// body...
		if (err) {
			return console.error(err);
		}
		// rawdata stores all origin data rows, groupedData stores the people records grouped by their belonged classes, clalist stores the classes string array, idlist stores all id string array
		rawdata = data.toString().split('\r\n'), groupedData = {}, clalist = [], idlist = []

		for (let i = 0; i < data.length; i++) {
			let tmparr = data[i].split(','), cla = tmparr[6]/toString(), id = tmparr[0].toString();
			idlist.push( id );

			if (cla === '-1') {
				continue
			}

			if (groupedData.hasOwnProperty( cla )) {
				groupedData[ cla ].push( tmparr );
			} else {
				clalist.push( cla );
				groupedData[ cla ] = [ tmparr ];
			}
		}

		MongoClient.connect(url, function (err, db) {
		  if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		  } else {
			//HURRAY!! We are connected. :)
			console.log('Connection established to', url);

			let collection = db.collection('features_beijing');

			collection.find({'_id': {
				"$in": idlist
			}}, {'pVec': 1, 'tpNumVec': 1}).toArray( mongoCallback );
		  }
		});
	}

	return data
}

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
			scriptdir = '/home/joe/Documents/git/living-modes-visual-comparison/server/scripts/',
			datadir = '/home/joe/Documents/git/living-modes-visual-comparison/server/data'

		let clsrun;

		if ( lib.checkDirectory( path.join(datadir, oupfile) ) ) {
			console.log('I am already exist.')
			res.json({'scode': 1, 'filename': datadir+oupfile})
		} else {
			clsrun = shell.exec(`cd ${scriptdir} && python ./ClusterUser.py -d ${datadir} -f ${inpfile} -x ${eps} -y ${minpts}`).stdout;
			if ( lib.checkDirectory( path.join(datadir, oupfile) ) ) {

				let recomdData = recomdCal(datadir, oupfile)
				res.json({'scode': 1, 'filename': datadir+oupfile})
			} else {
				res.json({'scode': 0 })
			}
		}		
	}
}

module.exports = home
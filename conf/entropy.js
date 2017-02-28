/**
 * entropy.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-01-08 20:16:29
 * @version $Id$
 */

'use strict'

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://192.168.1.42:27017/tdVC';

const fs = require('fs');
const path = require('path');
const data = require('./data');
const $sql = require('../controllers/apis/mysqlMapping');

function readIdlistMongo(dbname, queryrate, minVal, maxVal, prop) {
	let promise = new Promise(function(resolve, reject) {
		MongoClient.connect(url, function(err, db) {
			if (err) {
				reject(err)
			} else {
				let entropycondition = {};
				entropycondition[`entropy.${prop['entropytype']}`] = { 
					'$gte': Number.parseFloat(minVal), 
					'$lte': Number.parseFloat(maxVal) 
				} 

				db.collection(dbname).find({ '$and': [
					{'_id': { '$mod' : [Number.parseInt(queryrate), 0] }},
					entropycondition 
				]}, {
					'_id': 1
				}).toArray(function(err, data) {
					if (err) {
						reject(err)
					} else {
						let idlist = []
						for (let i = data.length - 1; i >= 0; i--) {
							idlist.push(data[i]['_id'])
						}
						resolve([idlist, db])
					}
				})
			}
		})
	})

	return promise
}

function readIdlistFile(dir, file) {
	 let promise = new Promise(function(resolve, reject) {
		 fs.readFile(path.join(dir, file), function(err, data) {
			 if (err) {
				reject(err)
			 } else {
				let rawdata = data.toString().split('\n'),
					idlist = [],
					datalen = rawdata.length

				console.log('File Row: ', datalen)
				
				for (let i = 0; i < datalen / 10; i++) {
					let tmparr = rawdata[i].split(','),
						id = Number.parseInt(tmparr[0]);

					idlist.push(id);
				}

				resolve(idlist)
			 }
		 })
	 })

	 return promise
} 

function connectMongo() {
	 let promise = new Promise(function(resolve, reject) {
		MongoClient.connect(url, function(err, db) {
			if (err) {
				reject(err)
			} else {
				resolve(db)
			}
		})
	 })

	 return promise
}

function mongoQueries(idlist, db, prop) {
	let collectionFeature = db.collection('features_beijing'),
		collectionUser = db.collection('users_beijing'),
		collectionGrid = db.collection('templategrids_beijing'),
		entropytype = prop['entropytype'],
		eprop = "entropy." + entropytype

	let q1filter = {}
	q1filter[eprop] = 1
	// console.log(eprop)

	let q1 = new Promise(function(resolve, reject) {
		collectionFeature.find({
			'_id': { '$in': idlist }
		}, q1filter).toArray(function(err, data) {
			if (err) {
				reject(err)
			} else {
				console.log('Idlist length:', data.length)
				resolve(data)
			}
		})
	});
	let q2 = new Promise(function(resolve, reject) {
		collectionUser.find({
			'id': { '$in': idlist }
		}, {
			'geometry': 1, 
			'id': 1
		}).toArray(function(err, data) {
			if (err) {
				reject(err)
			} else {
				console.log('Records length:', data.length)
				resolve(data)
			}
		})
	});
	let q3 = new Promise(function(resolve, reject) {
		collectionGrid.find({}).sort({ 
			'properties.uid': 1 
		}).toArray(function(err, data) {
			if (err) {
				reject(err)
			} else {
				console.log('Grid length:', data.length)
				resolve(data)
			}
		})
	});

	return Promise.all([q1, q2, q3])
}

function getOverview(conn, prop) {
	let city = prop['city'],
		ftpval = prop['ftpval'], 
		entropyattr = `${prop['etype']+prop['ctype']}sval`,
		// densityattr = `${prop['etype'] === 'p'? 'v':'w'}${prop['ctype']}number`, 考虑 POI 的有效记录数和总量记录数不一致的情况
		densityattr = `w${prop['ctype']}number`,
		etable = `${city}Ematrix`,
		mtype = prop['mtype'];

	// prop['ftpval']
	if (ftpval) {
		etable = `${city}F${ftpval}mat`;
	}
	console.log('Query table name: ', etable);

	let p = new Promise(function(resolve, reject) {
		let sql = $sql.getValScale[mtype] + $sql.getOverviewVal[mtype],
			param = [entropyattr, densityattr, etable, entropyattr, densityattr, etable, entropyattr, densityattr];

		if (mtype === 'ave') {
			param = [entropyattr, densityattr, densityattr, etable, entropyattr, densityattr, densityattr, etable, entropyattr, densityattr];
		}

		conn.query(sql, param, function(err, result) {
			conn.release();

			if (err) {
				reject(err);
			} else {
				// result[0]: Max value of entropy 
				// result[1]: Entropy list
				console.log('eval type: ', typeof result[0][0]['eval']);

				let DATA = [],
					SPLIT = 0.003,
					centerincrement = 0.0015,//.toFixed(4),
					locs = data.getRegionBound(city),
					elist = result[1],
					reslen = elist.length

				for (let i = elist.length - 1; i >= 0; i--) {
					let id = Number.parseInt(elist[i]['id']),
						LNGNUM = parseInt((locs['east'] - locs['west']) / SPLIT + 1),
						latind = parseInt(id/LNGNUM),
						lngind = id-latind*LNGNUM,
						lat = (locs['south'] + latind * SPLIT),//.toFixed(3),
						lng = (locs['west'] + lngind * SPLIT),//.toFixed(3),
						lnginc = (lng+SPLIT),//.toFixed(3),
						latinc = (lat+SPLIT),//.toFixed(3),
						lngcen = (lng+centerincrement),//.toFixed(4),
						latcen = (lat+centerincrement),//.toFixed(4),
						coordsarr = [ [lng, lat], [lnginc, lat], [lnginc, latinc], [lng, latinc], [lng, lat] ]

					// "center" : { 
					// 	"type" : "Point", 
					// 	"coordinates" : [ 116.39340292117386, 39.98484242786196 ] 
					// }
					DATA.push({
						"geometry" : { 
							"type" : "Polygon", 
							"coordinates" : [ coordsarr ] 
						}, 
						"type" : "Feature", 
						"id" : id, 
						"properties" : {
							'entropy': parseFloat(elist[i]['eval']),
							'density': parseInt(elist[i]['dval']),
							'center': [lngcen, latcen]
						}
					}) 
				}
				
				resolve({
					'scode': 1,
					'data': { 
						"type": "FeatureCollection",
						"features": DATA,
						"prop": {
							'emax': parseFloat(result[0][0]['eval']),
							'dmax': parseInt(result[0][0]['dval'])
						}
					}
				})
			}
		})
	})

	return p;
}

function generateGridsJson(locs, obj) {
	fs.exists('myjsonfile.json', function(exists){
		if(exists){
			console.log("yes file exists");
		} else {
			console.log("file not exists");
			
			var json = JSON.stringify(obj);
			fs.writeFile('myjsonfile.json', json);
		}
	});
}

module.exports = {
	readIdlistMongo: readIdlistMongo,
	readIdlistFile: readIdlistFile,
	connectMongo: connectMongo,
	mongoQueries: mongoQueries,
	getOverview: getOverview
}
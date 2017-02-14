/**
 * entropy.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-01-08 20:16:29
 * @version $Id$
 */

'use strict'

let mongodb = require('mongodb');
let MongoClient = mongodb.MongoClient;
let url = 'mongodb://192.168.1.42:27017/tdVC';

let fs = require('fs');
let path = require('path');
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

function getEntropy(conn, city, type) {
	let p = new Promise(function(resolve, reject) {
		let sql = $sql.getOverviewEntropy,
			param = []

		conn.query(sql, param, function(err, result) {
            if (err) {
            	reject(err)
            } else {
            	// numberID
            	
            	let DATA = []

            	let SPLIT = 0.003,
            		centerincrement = 0.0015,//.toFixed(4),
            		locs = data.getRegionBound(city),
            		reslen = result.length

            	for (let i = result.length - 1; i >= 0; i--) {
            		let LNGNUM = parseInt((locs['east'] - locs['west']) / SPLIT + 1),
		            	latind = parseInt(i/LNGNUM),
		            	lngind = i-latind*LNGNUM,
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
		            	"id" : i, 
		            	"properties" : {
		            		'val': parseFloat(result[i]['val'])
		            	}
		            }) 
            	}
	            
            	resolve(DATA)
            }
        })
	})

	return p
}

module.exports = {
	readIdlistMongo: readIdlistMongo,
	readIdlistFile: readIdlistFile,
	connectMongo: connectMongo,
	mongoQueries: mongoQueries,
	getEntropy: getEntropy
}
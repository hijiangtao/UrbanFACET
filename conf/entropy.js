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
				
				for (let i = 0; i < datalen; i++) {
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
				// console.log(data)
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
				resolve(data)
			}
		})
	});

	return Promise.all([q1, q2, q3])
}

module.exports = {
	readIdlistMongo: readIdlistMongo,
	readIdlistFile: readIdlistFile,
	connectMongo: connectMongo,
	mongoQueries: mongoQueries
}
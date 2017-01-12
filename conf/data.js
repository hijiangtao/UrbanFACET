/**
 * data.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2016-12-20 17:10:34
 * @version $Id$
 */

'use strict'
// MongoDB Settings
let mongodb = require('mongodb');
let MongoClient = mongodb.MongoClient;
let url = 'mongodb://192.168.1.42:27017/tdVC';

// MySQL Settings
let pool = require('./db');

let getValue = function(key, type) {
	let features = ['workday', 'weekend', 'daytime', 'evening', 'wodaytime', 'weevening'],
		themes = {
			'edu': 2,
			'empl': 7,
			'tour': 1,
			'heal': 4,
			'stu': 2,
			'fini': 5
		},
		timeperiods = {
			'1': {
				'starthour': 50,
				'endhour': 90,
				'name': 'morning',
				'hourlist': [5,6,7,8]
			},
			'2': {
				'starthour': 80,
				'endhour': 120,
				'name': 'forenoon',
				'hourlist': [8,9,10,11]
			},
			'3': {
				'starthour': 110,
				'endhour': 140,
				'name': 'noon',
				'hourlist': [11,12,13]
			},
			'4': {
				'starthour': 130,
				'endhour': 190, 
				'name': 'afternoon',
				'hourlist': [13,14,15,16,17,18]
			},
			'5': {
				'starthour': 180,
				'endhour': 240,
				'name': 'evening',
				'hourlist': [18,19,20,21,22,23]
			},
			'6': {
				'starthour': 230,
				'endhour': 60,
				'name': 'night',
				'hourlist': [23,0,1,2,3,4,5]
			},
			'7': {
				'starthour': 0,
				'endhour': 240,
				'name': 'workday',
				'hourlist': [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
			},
			'8': {
				'starthour': 0,
				'endhour': 240,
				'name': 'holiday',
				'hourlist': [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
			},
			'9': {
				'starthour': 0,
				'endhour': 240,
				'name': 'all',
				'hourlist': [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
			}
		}

	if (type === 'feature') {
		return features[ Number.parseInt( key )-1 ]
	} else if (type === 'theme') {
		return themes[key]
	} else if (type === 'timeperiod') {
		return timeperiods[key]
	}

	return ''
}

let connectMongo = function() {
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

let connectMySQL = function(argument) {
	let promise = new Promise(function(resolve, reject) {
		pool.getConnection(function(err, connection) {
			if (err) {
				reject(err)
			} else {
				resolve(connection)
			}
		})
	})

	return promise
}

module.exports = {
	getValue: getValue,
	connectMongo: connectMongo,
	connectMySQL: connectMySQL
}
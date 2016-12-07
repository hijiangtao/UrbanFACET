// /userQuery.js
// 实现与MySQL交互

let Http = require('http');
let fs = require('fs');
let path = require('path');
let GeoJSON = require('geojson');
let csv = require('fast-csv');

// 使用连接池，提升性能
var $sql = require('./userSqlMapping');
var pool = require('../../conf/db');

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://192.168.1.42:27017/tdBJ';

/**
 * [formatCluster description]
 * @param  {[type]} data   [description]
 * @param  {[type]} clubeg [description]
 * @param  {[type]} cluend [description]
 * @return {[type]}        [description]
 */
function formatCluster(data, clubeg, cluend) {
	var idlist = {}, clusterlist = []
	for (var i = clubeg; i <= cluend; i++) {
		idlist[ i.toString() ] = []
		clusterlist.push(i.toString())
	}

	for (var i = data.length - 1; i >= 0; i--) {
		idlist[ data[i][1].toString() ].push( parseInt(data[i][0]) )
	}

	return {
		'userlist': idlist,
		'clusterlist': clusterlist
	}
}

let userQuery = {
	/**
	 * [test description]
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	test(req, res, next) {
		"use strict"
		let tbname = 'cbeijing',
			params = req.query,
			id = params.id;

		let typearr = params.type == "all" ? ["holiday", "workday"]:[params.type.toString()];

		console.log(typearr);

		// [tbname, id, typearr]

		pool.getConnection(function(err, connection) {
			connection.query($sql.randomOverview, [tbname, "workday"], function(err, result) {
			// connection.query($sql.randomQuery, [tbname, id, typearr], function(err, result) {
				if (err) throw err;

				let data = GeoJSON.parse(result, {Point: ['lat', 'lng']});

				res.json(data);
				connection.release();
			});
		})
	},
	queryUserbyID(req, res, next) {
		"use strict"
		let tbname = 'cbeijing',
			params = req.query,
			id = params.id;

		let typearr = params.type == "all" ? ["holiday", "workday"]:[params.type.toString()];

		// console.log(typearr);

		// [tbname, id, typearr]

		pool.getConnection(function(err, connection) {
			// console.log('connect to mysql.')
			connection.query($sql.randomQuery, [tbname, id, typearr], function(err, result) {
				if (err) throw err;
				console.log("Points: ", result.length)

				let data = []
				if (result.length != 0) 
					data = GeoJSON.parse(result, {Point: ['lat', 'lng']});

				res.json(data);
				connection.release();
			});
		})
	},
	/**
	 * [getHLG description]
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	getHLG(req, res, next) {
		"use strict"
		let tbname = 'hlg_rec',
			params = req.query,
			time = Number.parseInt(params.time),
			stime = time * 6,
			etime = time * 6 + 7;

		pool.getConnection(function(err, connection) {
			connection.query($sql.queryRecords, [tbname, stime, etime], function(err, result) {
				if (err) throw err;

				let data = GeoJSON.parse(result, {Point: ['lat', 'lng']});

				res.json(data);
				connection.release();
			});
		})
	},
	/**
	 * [devquery description]
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	devquery(req, res, next) {
		"use strict"
		let params = req.query,
			type = params.type;

		console.log(params);

		pool.getConnection(function(err, connection) {
			connection.query($sql.randomDevList, [type], function(err, result) {
				if (err) throw err;

				res.json(result);
				connection.release();
			})
		})
	},
	/**
	 * [clusterInit description]
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	clusterInit(req, res, next) {
		// console.log(process.cwd())
		var stream = fs.createReadStream("public/data/KMeans-1-in-10-tsne-label-deftype-1-[k-8].csv");
		var idlist = [], cluster = []

		var csvStream = csv()
		    .on("data", function(data){
		         idlist.push(data);
		    })
		    .on("end", function(){
		         console.log("CSV file reading done");
		         res.send(formatCluster(idlist, 0, 7));
		    });

		var tmp = stream.pipe(csvStream);
		// console.log(tmp);
	}, 
	clusterUserQuery(req, res, next) {
		"use strict"
		let param = req.query,
			id = parseInt(param.id);

		MongoClient.connect(url, function (err, db) {
		  if (err) {
		    console.log('Unable to connect to the mongoDB server. Error:', err);
		  } else {
		    //HURRAY!! We are connected. :)
		    console.log('Connection established to', url);

		    var collection = db.collection('beijing_features');

		    collection.find({'_id': id}).toArray(function (err, result) {
		      if (err) {
		        console.log(err);
		      } else if (result.length) {
		        // console.log('Found:', result);

				var resdata = [], definedtype = ['workdayM', 'workdayF', 'workdayN', 'workdayA', 'workdayE', 'workdayI', 'holidayM', 'holidayF', 'holidayN', 'holidayA', 'holidayE', 'holidayI']
 		        for (var i = 0; i <= result[0]['vec'].length - 1; i++) {
		        	resdata.push( [definedtype[i]].concat(result[0]['vec'][i]) )
		        }
		        res.send({
		        	'data': resdata,
		        	'recnum': result[0]['recnum'],
		        	'num': result[0]['num']
		        });
		      } else {
		        console.log('No document(s) found with defined "find" criteria!');
		      }
		      //Close connection
		      db.close();
		    });
		  }
		});
	}
}

module.exports = userQuery;
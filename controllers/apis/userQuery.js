// /userQuery.js
'use strict'

let Http = require('http');
let fs = require('fs');
let path = require('path');
let GeoJSON = require('geojson');

// 使用连接池，提升性能
let $sql = require('./userSqlMapping');
let pool = require('../../conf/db');

let mongodb = require('mongodb');
let MongoClient = mongodb.MongoClient;
let url = 'mongodb://192.168.1.42:27017/tdVC';

let lib = require('../../conf/lib');

/**
 * [formatCluster description]
 * @param  {[type]} data   [description]
 * @param  {[type]} clubeg [description]
 * @param  {[type]} cluend [description]
 * @return {[type]}        [description]
 */
function formatCluster(data, clubeg, cluend) {
	let idlist = {}, clusterlist = []
	for (let i = clubeg; i <= cluend; i++) {
		idlist[ i.toString() ] = []
		clusterlist.push(i.toString())
	}

	for (let i = data.length - 1; i >= 0; i--) {
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
	queryClusterStats(req, res, next) {
		let params = req.body,
			file = params.file,
			classes = params['id[]'][0]

		let idlist = [];
		
		fs.readFile(path.join(__dirname, `../../public/data/2D-ScatterData_1-in-3_tsne-${file}.csv`), function (err, data) {
		   if (err) {
			  return console.error(err);
		   }
		   data = data.toString().split('\r\n')

		   for (let i = 0; i < data.length; i++) {
		   	let tmparr = data[i].split(',');
		   	if (tmparr[5] == classes) {
		   		idlist.push(parseInt(tmparr[0]))
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
				}}, {'pVec': 1, 'tpNumVec': 1}).toArray(function (err, result) {
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
				});
			  }
			});
		});

		// for (let i = 0; i < data.length; i++) {
		// 	if (data[i]['class'].toString() === classes) {
		// 		idlist.push(data[i]['id'])
		// 	}
		// }
		
		
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
		let stream = fs.createReadStream("public/data/KMeans-1-in-10-tsne-label-deftype-1-[k-8].csv");
		let idlist = [], cluster = []

		let csvStream = csv()
			.on("data", function(data){
				 idlist.push(data);
			})
			.on("end", function(){
				 console.log("CSV file reading done");
				 res.send(formatCluster(idlist, 0, 7));
			});

		let tmp = stream.pipe(csvStream);
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

			let collection = db.collection('beijing_features');

			collection.find({'_id': id}).toArray(function (err, result) {
			  if (err) {
				console.log(err);
			  } else if (result.length) {
				// console.log('Found:', result);

				let resdata = [], definedtype = ['workdayM', 'workdayF', 'workdayN', 'workdayA', 'workdayE', 'workdayI', 'holidayM', 'holidayF', 'holidayN', 'holidayA', 'holidayE', 'holidayI']
				for (let i = 0; i <= result[0]['vec'].length - 1; i++) {
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
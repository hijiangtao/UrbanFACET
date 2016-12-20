/**
 * lab.js in apis
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2016-12-20 16:04:30
 * @version $Id$
 */
'use strict'

let fs = require('fs');
let path = require('path');

let mongodb = require('mongodb');
let MongoClient = mongodb.MongoClient;
let url = 'mongodb://192.168.1.42:27017/tdVC';

let lib = require('../../conf/lib');

let lab = {
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
	}
}

module.exports = lab;
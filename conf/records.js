/**
 * records.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-01-16 23:09:26
 * @version $Id$
 */
let DATA = require('./data');
let GeoJSON = require('geojson');
let $sql = require('../controllers/apis/mysqlMapping');

let getAreaRecords = function(conn, params) {
	let region = params.region.toLowerCase(),
		area = params.area,
		id = params.id,
		tp = params.tp,
		daytype = params.daytype,
		tpspecific = DATA.getValue(tp, 'timeperiod')

	let sql = $sql.arearecordsquery,
		param = [`${region}_${area}_records`, tpspecific['starthour'], tpspecific['endhour'], daytype ]

	let promise = new Promise(function(resolve, reject) {
		conn.query(sql, param, function(err, result) {
			if (err) {
				reject(err)
			} else {
				console.log('RESULT LENGTH: ', result.length)
				for (let i = result.length - 1; i >= 0; i--) {
					result[i]['group'] = tp
				}
				resolve( GeoJSON.parse(result, {Point: ['lat', 'lng']}) )
			}
		})
	})	

	return promise
}

let getOneTypeSeriesData = function(conn, data, clalist, prop) {
	let rawdata = data.toString().split('\n'),
		idlist = [],
		idclaRelation = {}

	console.log('File Row: ', rawdata.length, 'clalist', clalist)

	for (let i = 0; i < rawdata.length; i++) {
		let tmparr = rawdata[i].split(','),
			cla = Number.parseInt(tmparr[6]).toString(),
			id = Number.parseInt(tmparr[0]);

		if (lib.ArrayContains(clalist, cla)) {
			idlist.push(id);
			idclaRelation[ id.toString() ] = cla;
		}
	}

	let sql, param
	if (prop[0]['daytype'] === 'all') {
		sql = $sql.spetpqueryrecords
		param = [idlist, prop[0]['tp']['name'] === 'all'? ['workday', 'holiday']:[prop[0]['tp']['name']]]
	} else {
		if (prop[0]['tp']['name'] === 'night') {
			sql = $sql.tpqueryrecordsNight
		} else {
			sql = $sql.tpqueryrecords
		}
		sql = $sql.tpqueryrecords
		param = [idlist, prop[0]['daytype'], prop[0]['tp']['starthour'], prop[0]['tp']['endhour']]
	}

	let promise = new Promise(function(resolve, reject) {
		conn.query(sql, param, function(err, result) {
			if (err) {
				reject(err)
			} else {
				for (let i = result.length - 1; i >= 0; i--) {
					let tmpclastr = idclaRelation[ result[i]['id'].toString() ]
					result[i]['cla'] = `Class ${tmpclastr}`
					result[i]['tp'] = prop[0]['tpstr']
				}

				let data = GeoJSON.parse(result, { Point: ['lat', 'lng'] }),
					property = {
						'cla': `Class ${clalist[0]}`,
						'tp': prop[0]['tpstr']
					} 

				conn.release();
				resolve(data, property)
			}
		})
	})

	return promise
}

let generateGridJSON = function(values, prop) {
	let idEntropy = values[0],
		records = values[1],
		grids = values[2],
		entropytype = prop['entropytype']

	let identropyrelation = {}

	for (let i = idEntropy.length - 1; i >= 0; i--) {
		// console.log(idEntropy[i])
		identropyrelation[ idEntropy[i]['_id'].toString() ] = parseFloat(idEntropy[i]['entropy'][entropytype])
	}

	let recordslen = records.length

	for(let i = 0; i < recordslen; i++) {
		let id = records[i]['id'].toString(),
			lat = records[i]['geometry']['coordinates'][1],
			lng = records[i]['geometry']['coordinates'][0],
			lngind = parseInt((parseFloat(lng) - 115.64) / 0.01),
			latind = parseInt((parseFloat(lat) - 39.39) / 0.01),
			uid = lngind + latind * 152,
			entropy = identropyrelation[id]

		let currentEntropy = grids[uid]['properties']['entropy'][entropytype],
			currentNumber = grids[uid]['properties']['recordnum']

		grids[uid]['properties']['entropy'][entropytype]=(currentEntropy * currentNumber + entropy) / (currentNumber + 1)
		grids[uid]['properties']['recordnum'] += 1
	}

	let parsedGeoJSON = { 
		"type": "FeatureCollection",
	    "features": []
	}

	for (let i = grids.length - 1; i >= 0; i--) {
		parsedGeoJSON['features'].push({
		  "type": "Feature",
		  "geometry": grids[i]['geometry'],
		  "properties": {
			"uid": grids[i]['properties']['uid'],
			"entropy": grids[i]['properties']['entropy'][entropytype],
			"number": grids[i]['properties']['recordnum'],
			"center": grids[i]['properties']['center']
		  }
		})
	}

	return [prop['id'], parsedGeoJSON]
}

let updateTmpClassResults = function(db, collection, data) {
	let promise = new Promise(function(resolve, reject) {
		db.collection(collection).insertMany(data, function(err, result) {
			if (err) {
				reject(err)
			} else {
				resolve(data)
			}
		})
	})

	return promise
}

let emptyTmpClassResults = function(db, collection) {
	let promise = new Promise(function(resolve, reject) {
		db.collection(collection).deleteMany({ 'userid': idstr }, function(err, result) {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		})
	})

	return promise
}

let calGroupedPeopleMatrix = function(db, collection, idlist) {
	let promise = new Promise(function(resolve, reject) {
		db.collection(collection).find(
			{ '_id': { '$in': idlist } }, 
			{ 'pVec': 1, 'tpNumVec': 1, 'totalNum': 1 }
		).toArray(function(err, result) {
			console.timeEnd("Id Query")
			if (err) {
				reject(err)
			} else {
				resolve(result)
			}
		})
	})

	return promise
}

let calGroupedPeopleMatrixCallback = function(result, prop) {
	let clalist = prop['clalist'],
		idstr = prop['idstr'],
		claidRelation = prop['claidRelation'],
		file = prop['file']

	let matrixsum = {},
		recnumdata = {}; // 存的所有人 matrix 集合加和, 以及分时段的定位次数加和

	console.time("Matrix sum result");

	if (result.length) {
		// 计算每个类别下的累积 matrix 和分时段定位 array
		for (let i = 0; i < result.length; i++) {
			let id = result[i]['_id'].toString(),
				pVec = result[i]['pVec'],
				tpNumVec = result[i]['tpNumVec'],
				totalNum = result[i]['totalNum'],
				cla = claidRelation[id];

			if (!(cla in matrixsum)) {
				matrixsum[cla] = lib.MatrixAdd(result[i]['pVec'], result[i]['pVec'], 0.5, 2)
				recnumdata[cla] = result[i]['tpNumVec']
			} else {
				matrixsum[cla] = lib.MatrixAdd(result[i]['pVec'], matrixsum[cla], 1, 2)
				recnumdata[cla] = lib.MatrixAdd(recnumdata[cla], result[i]['tpNumVec'], 1, 1)
			}
		}
	} else {
		console.log('No document(s) found with defined "find" criteria!');
	}

	console.timeEnd("Matrix sum result")

	console.time("Class aggregation")
	let data = []
	for (let x = 0; x < clalist.length; x++) {
		// 统计档案
		let cla = clalist[x]
		let tmpresult = {},
			poirowsum = [],
			poiwholesum = 0,
			recsum = recnumdata[cla].reduce((a, b) => a + b, 0)

		// 删除 matrix 最后一栏 POI
		for (let i = 0; i < 12; i++) {
			matrixsum[cla][i].splice(10, 1);
			poirowsum.push(matrixsum[cla][i].reduce((a, b) => a + b, 0))
		}
		poiwholesum = poirowsum.reduce((a, b) => a + b, 0)

		tmpresult['userid'] = idstr
		tmpresult['id'] = cla
		tmpresult['poisum'] = poiwholesum
		tmpresult['recsum'] = recsum
		tmpresult['matrix'] = matrixsum[cla]


		// POI Types
		for (let i = 0; i < 10; i++) {
			// Time periods 0-5
			for (let j = 0; j < 6; j++) {
				let molecular = Number.parseFloat(matrixsum[cla][j][i] + matrixsum[cla][j + 6][i])
				if (molecular < ZERO) {
					tmpresult[`POI-${i}-t${j}`] = 0
				} else {
					tmpresult[`POI-${i}-t${j}`] = molecular / (poirowsum[j] + poirowsum[j + 6])
				}

			}
			// specific time periods 6-
			// 
			let moleculart6 = sixcolsum(i, 0, 'matrixsum'),
				moleculart7 = sixcolsum(i, 1, 'matrixsum'),
				moleculart8 = matrixsum[cla][1][i] + matrixsum[cla][2][i] + matrixsum[cla][3][i] + matrixsum[cla][7][i] + matrixsum[cla][8][i] + matrixsum[cla][9][i]

			if (moleculart6 < ZERO) {
				tmpresult[`POI-${i}-t6`] = 0
			} else {
				tmpresult[`POI-${i}-t6`] = moleculart6 / sixcolsum(i, 0, 'poirowsum')
			}

			if (moleculart7 < ZERO) {
				tmpresult[`POI-${i}-t7`] = 0
			} else {
				tmpresult[`POI-${i}-t7`] = moleculart7 / sixcolsum(i, 1, 'poirowsum')
			}

			if (moleculart8 < ZERO) {
				tmpresult[`POI-${i}-t8`] = 0
			} else {
				tmpresult[`POI-${i}-t8`] = moleculart8 / (poirowsum[1] + poirowsum[2] + poirowsum[3] + poirowsum[7] + poirowsum[8] + poirowsum[9])
			}

			function sixcolsum(poi, index, type) {
				let result = 0.0
				if (type === 'matrixsum') {
					for (let i = 0; i < 6; i++) {
						result += matrixsum[cla][i + index * 6][poi]
					}
				} else {
					for (let i = 0; i < 6; i++) {
						result += poirowsum[i + index * 6]
					}
				}

				return result
			}
		}

		data.push(tmpresult)
	}
	console.timeEnd("Class aggregation")

	console.time("Insert class results into mongo")
}

module.exports = {
	getAreaRecords: getAreaRecords,
	getOneTypeSeriesData: getOneTypeSeriesData,
	generateGridJSON: generateGridJSON,
	emptyTmpClassResults: emptyTmpClassResults,
	updateTmpClassResults: updateTmpClassResults
}
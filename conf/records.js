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
		  }
		})
	}

	return [prop['id'], parsedGeoJSON]
}

module.exports = {
	getAreaRecords: getAreaRecords,
	getOneTypeSeriesData: getOneTypeSeriesData,
	generateGridJSON: generateGridJSON
}
/**
 * apis.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-02-19 20:36:48
 * @version $Id$
 */

'use strict'
import $ from "jquery"

let getValRange = function(scales, esels, dsels, vuesels) {
	return {
		// 'entropy': {
		// 	'min': Math.log( scales.entropy * parseFloat(esels[0]) / 100.0 + 1 ),
		// 	'max': Math.log( scales.entropy * parseFloat(esels[1]) / 100.0 + 1 ),
		// 	'scales': Math.log( scales.entropy + 1 )
		// },
		// 'density': {
		// 	'min': Math.log( scales.density * parseFloat(dsels[0]) / 100.0 ),
		// 	'max': Math.log( scales.density * parseFloat(dsels[1]) / 100.0 ),
		// 	'scales': Math.log( scales.density )
		// },
		'entropy': {
			'min': Math.exp( Math.log(scales.entropy+1) * parseFloat(esels[0]) / 100.0 )-1,
			'max': Math.exp( Math.log(scales.entropy+1) * parseFloat(esels[1]) / 100.0 )-1,
			'scales': scales.entropy
		},
		'density': {
			'min': Math.exp( Math.log(scales.density) * parseFloat(dsels[0]) / 100.0 ),
			'max': Math.exp( Math.log(scales.density) * parseFloat(dsels[1]) / 100.0 ),
			'scales': scales.density
		},
		'type': vuesels.displaytype,
		'multiColorSchema': vuesels.multiColorSchema,
		'useLocalExtrema': vuesels.useLocalExtrema,
		'displaySchema': vuesels.dtype
	}
};

let getSubGrids = function(poly, center, num=4) {
	if (num === 4) {
		return [
			{
				'nw': [center[1], poly[0][0]],
				'se': [poly[0][1], center[0]]
			},{
				'nw': [center[1], center[0]],
				'se': [poly[1][1], poly[1][0]]
			},{
				'nw': [poly[2][1], center[0]],
				'se': [center[1], poly[2][0]]
			},{
				'nw': [poly[3][1], poly[3][0]],
				'se': [center[1], center[0]]
			},
		]
	}
};

let getOverviewDatasets = function(sels) {
	let city = sels.city,
		etype = sels.etype,
		ctype = sels.ctype,
		mtype = sels.mtype,
		tpfilter = sels.tpfilter,
		ftpval = tpfilter? `&ftpval=${sels.ftpval}`:'';
	console.log('tpfilter: ', tpfilter);
	
	let p = new Promise(function(resolve, reject) {
		$.get(`/comp/overviewQuery?city=${city}&etype=${etype}&ctype=${ctype}&mtype=${mtype+ftpval}`, function(res, err) {
			if (res['scode']) {
				resolve(res['data'])
			} else {
				reject(err)
			}
		});
	});

	return p;
};

let getDensity = function(sels) {
	let city = sels.city,
		etype = sels.etype,
		ctype = sels.ctype,
		mtype = sels.mtype;

	let p = new Promise(function(resolve, reject) {
		if (etype === 'p') {
			etype = 'v';
		} else {
			etype = 'w';
		}

		$.get(`/comp/overviewQuery?city=${city}&etype=${etype}&ctype=${ctype}&mtype=${mtype}`, function(res, err) {
			if (res['scode']) {
				resolve(res['data']);
			} else {
				reject(err);
			}
		});
	});

	return p;
};

let getLinearNum = function(target, minVal, maxVal, minNum, maxNum) {
	if (target < minVal) {
		return 0;
	} else if (target > maxVal) {
		return maxNum;
	}

	let a = (maxNum-minNum) / Number.parseFloat(maxVal-minVal),
		b = minNum - minVal*a; 

	return Number.parseInt( a * target + b );
}

let getRandomCenter = function(point, base, scale) {
	let lng = (point[0]+base) + Math.random()*scale,
		lat = (point[1]+base) + Math.random()*scale;

	return [lng, lat]
}

export {
	getOverviewDatasets,
	getDensity,
	getValRange,
	getSubGrids,
	getLinearNum,
	getRandomCenter
}
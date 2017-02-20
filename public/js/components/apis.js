/**
 * apis.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-02-19 20:36:48
 * @version $Id$
 */

'use strict'
import $ from "jquery"

let getValRange = function(scales, esels, dsels) {
	return {
		'entropy': {
			'min': scales.entropy * parseFloat(esels[0]) / 100.0,
			'max': scales.entropy * parseFloat(esels[1]) / 100.0,
			'scales': scales.entropy
		},
		'density': {
			'min': scales.density * parseFloat(dsels[0]) / 100.0,
			'max': scales.density * parseFloat(dsels[1]) / 100.0,
			'scales': scales.density
		}
	}
};

let getOverview = function(sels) {
	let city = sels.city,
		etype = sels.etype,
		ctype = sels.ctype,
		mtype = sels.mtype;

	let p = new Promise(function(resolve, reject) {
		$.get(`/comp/overviewQuery?city=${city}&etype=${etype}&ctype=${ctype}&mtype=${mtype}`, function(res, err) {
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

export {
	getOverview,
	getDensity,
	getValRange
}
/**
 * apis.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-02-19 20:36:48
 * @version $Id$
 */

'use strict'
import $ from "jquery"

let getValRange = function(base, selections) {
	return {
		'min': base.min+selections.min * Number.parseFloat(base.max-base.min),
		'max': base.min+selections.max * Number.parseFloat(base.max-base.min)
	}
};

let getEntropy = function(sels) {
	let city = sels.city,
		etype = sels.etype,
		ctype = sels.ctype,
		emin = sels.eVal.min,
		emax = sels.eVal.max;

	let p = new Promise(function(resolve, reject) {
		$.get(`/comp/overviewEQuery?city=${city}&etype=${etype}&ctype=${ctype}&emin=${emin}&emax=${emax}`, function(res, err) {
			if (res['scode']) {
				resolve(res['data'])
			} else {
				reject(err)
			}
		})
	});

	return p;
};

let getDensity = function(sels) {
	let city = sels.city,
		etype = sels.etype,
		ctype = sels.ctype,
		emin = sels.eVal.min,
		emax = sels.eVal.max;

	let p = new Promise(function(resolve, reject) {
		if (etype === 'p') {
			etype = 'v';
		} else {
			etype = 'w';
		}
		$.get(`/comp/overviewDQuery?city=${city}&etype=${etype}&ctype=${ctype}&emin=${emin}&emax=${emax}`, function(res, err) {
			if (res['scode']) {
				resolve(res['data']);
			} else {
				reject(err);
			}
		})
	});

	return p;
};

export {
	getEntropy,
	getDensity,
	getValRange
}
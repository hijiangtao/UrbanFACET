/**
 * data.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2016-12-20 17:10:34
 * @version $Id$
 */

'use strict'

let getValue = function(key, type) {
	let features = ['workday', 'weekend', 'daytime', 'evening', 'wodaytime', 'weevening'],
		themes = {
			'edu': 2,
			'empl': 7,
			'tour': 1,
			'heal': 4,
			'stu': 2,
			'fini': 5
		}

	if (type === 'feature') {
		return features[ Number.parseInt( key )-1 ]
	} else if (type === 'theme') {
		return themes[key]
	} else if (type === '') {
		return ''
	}

	return ''
}

module.exports = {
	getValue: getValue
}
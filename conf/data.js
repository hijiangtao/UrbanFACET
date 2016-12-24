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
		},
		timeperiods = {
			'1': {
				'starthour': 5,
				'endhour': 9
			},
			'2': {
				'starthour': 8,
				'endhour': 12
			},
			'3': {
				'starthour': 11,
				'endhour': 14
			},
			'4': {
				'starthour': 13,
				'endhour': 19
			},
			'5': {
				'starthour': 18,
				'endhour': 24
			},
			'6': {
				'starthour': 23,
				'endhour': 6
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

module.exports = {
	getValue: getValue
}
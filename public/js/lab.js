/**
 * lab.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2016-12-13 14:27:47
 * @version $Id$
 */

'use strict'

import * as d3 from 'd3'
import * as echarts from 'echarts'
import Vue from 'vue'
import ArrayContains from './components/lib'

let data = {
	begin: false,
	cluster: [{
		'name': '居住区信息统计',
		'val': 'res'
	}, {
		'name': '商业区信息统计',
		'val': 'com'
	}, {
		'name': '饮食休闲娱乐信息统计',
		'val': 'ent'
	}, {
		'name': '教育场所信息统计',
		'val': 'edu'
	}],
	clustersel: "res",
	results: [{
		"name": 'workday',
		"val": 1
	}, {
		"name": 'weekend',
		"val": 2
	}, {
		'name': 'daytime',
		'val': 3
	}, {
		'name': 'evening',
		'val': 4
	}, {
		'name': 'wodaytime',
		'val': 5
	}, {
		'name': 'weevening',
		'val': 6
	}],
	resultsel: 'daytime',
	idlist: "",
	curDataset: [],
	timeperiods: [{
		'name': 'morning ',
		'value': 0
	},{
		'name': 'forenoon ',
		'value': 1
	},{
		'name': 'noon',
		'value': 2
	},{
		'name': 'afternoon ',
		'value': 3
	},{
		'name': 'evening ',
		'value': 4
	},{
		'name': 'night ',
		'value': 5
	}],
	tpsel: []
}


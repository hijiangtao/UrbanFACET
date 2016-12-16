/**
 * lab.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2016-12-13 14:27:47
 * @version $Id$
 */

'use strict'

import $ from 'jquery'
import Vue from 'vue'
import analysistools from './components/analysistools'

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

let labins = new analysistools()
let clarifyins = new Vue({
	el: "#labcontainer",
	data: data,
	methods: {
		getStats: function() {
			let self = this
			
			// 获得class列表
			let idarr = self.idlist.split(',')

			// 拼接用户id以及所选统计模式
			$.post("/users/api/v1/lab/queryClusterStats", {
				'file': self.resultsel,
				'id': idarr
			}, function(res, err) {
				self.curDataset = res
				labins.drawMatrix(res['matrixdata'], labins.dividlist['matrixid'])
				labins.drawPOIStats(res['matrixdata'], labins.dividlist['barid'])
				labins.drawOcpStats(res['matrixdata'], labins.dividlist['pieid'], self.clustersel, self.tpsel)
				labins.drawRecNum(res['recnumdata'], labins.dividlist['recid'])
			})
			self.begin=true
		},
		loadData: function() {
			labins.loadData(`/data/2D-ScatterData_1-in-3_tsne-${this.resultsel}.csv`)
		}
	},
	watch: {
		clustersel: function(val, oldVal){
			let self = this
			labins.drawOcpStats(self.curDataset['matrixdata'], self.dividlist['pieid'], val, self.tpsel)
		},
		tpsel: function(val, oldVal) {
			let self = this
			if(self.begin) {
				labins.drawOcpStats(self.curDataset['matrixdata'], self.dividlist['pieid'], self.clustersel, self.tpsel)
			}
		}
	}
})


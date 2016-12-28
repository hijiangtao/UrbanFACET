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

import {labvuedata} from './components/initdata'

let labins = new analysistools('scatterplot', 'matrixplot')
let clarifyins = new Vue({
	el: "#labcontainer",
	data: labvuedata,
	methods: {
		getStats: function() {
			let self = this
			
			// 获得class列表
			let idarr = self.idlist.split(',')

			// 拼接用户id以及所选统计模式
			$.post("/lab/v1/queryClusterStats", {
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


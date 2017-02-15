/**
 * comp.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-02-12 16:21:47
 * @version $Id$
 */

'use strict'

import Vue from 'vue'
import Vuex from 'vuex'
import mapview from './components/xmap-view'
import $ from "jquery"
window.jQuery = $
import {regionRecords} from './components/initdata'

Vue.use(Vuex)

let mapins = new mapview('map')

const store = new Vuex.Store({
  state: {
	'drawData': {}
  },
  mutations: {
    updateCity (data) {
      state.drawData = data
    }
  }
})

const userpanel = new Vue({
	el: '#userpanel',
    data: {
    	'params': {
    		'regions': [
    			{ 'name': 'Beijing', 'val': 'bj' },
	            { 'name': 'Tianjin', 'val': 'tj' },
	            { 'name': 'Zhangjiakou', 'val': 'zjk' },
	            { 'name': 'Tangshan', 'val': 'ts' }
    		],
    		'etypes': [
    			{ 'name': 'Point of Interests', 'val': 'poi' },
    			{ 'name': 'Admin Division', 'val': 'admin' },
    			{ 'name': 'Time Periods', 'val': 'timeperiod' }
    		],
    		'ctypes': [
    			{ 'name': 'People Entropy', 'val': 'p' }
    			// { 'name': 'Record Entropy', 'val': 'r' }
    		],
    		'range': {
    			'min': 0,
    			'max': 1.79
    		}
    	},
    	'selections': {
    		'city': 'tj',
    		'etype': 'poi',
    		'ctype': 'p',
    		'eVal': {
    			'min': 0,
    			'max': 1
    		}
    	},
    	'results': {
    		'drawData': {}
    	}
    },
    methods: {
    	'getEntropyOverview': function() {
    		let city = this.selections.city
    		if (city !== 'bj') {
				let self = this
				
    			mapins.panTo( regionRecords[city]['center'] )
    			getEntropy(city, self.selections.etype, self.selections.eVal.min, self.selections.eVal.max).then(function(res) {
    				// self.updateVals(res['prop'])
    				// self.results.drawData = res

    				let valRange = {
    					'min': self.selections.eVal.min * Number.parseFloat(self.params.range.min),
    					'max': self.selections.eVal.max * Number.parseFloat(self.params.range.max)
    				}
				  	mapins.mapgridCDrawing(res, valRange)
				}).catch(function(err) {
				  	console.error("Failed!", err);
				});
    		}
    	},
    	'regionImgUrl': function(city) {
    		return `/assets/${city}-icon.png`
    	},
    	// 'updateVals': function(props) {
    	// 	this.params.range.max = props.maxVal
    	// 	if (this.params.range.max < this.selections.eVal.min) {
    	// 		this.selections.eVal.min = 0
    	// 		this.selections.eVal.max = this.params.range.max
    	// 	} else if (this.params.range.max < this.selections.eVal.max) {
    	// 		this.selections.eVal.max = this.params.range.max
    	// 	}
    	// },
    	'updateCity': function(val) {
    		this.selections.city = val
    	}
    },
    // computed: {
    	
    // },
    watch: {
    	'selections.eVal.min': function(val) {
    		if (this.selections.eVal.min >= this.selections.eVal.max) {
    			alert('The minVal should not be larger than maxVal. Please do it again.');
    			this.selections.eVal.min = 0
    			return ;
    		}
    	},
    	'selections.eVal.max': function(val) {
    		if (this.selections.eVal.min >= this.selections.eVal.max) {
    			alert('The minVal should not be larger than maxVal. Please do it again.');
    			this.selections.eVal.max = this.params.range.max
    			return ;
    		}
    	}
    },
    mounted() {
    	this.$nextTick(function () {
			this.getEntropyOverview()
		})
    }
})

let getEntropy = function(city, type, emin, emax) {
	let p = new Promise(function(resolve, reject) {
		$.get(`/comp/overviewQuery?city=${city}&etype=${type}&ctype=p&emin=${emin}&emax=${emax}`, function(res, err) {
			if (res['scode']) {
				resolve(res['data'])
			} else {
				reject(err)
			}
		})
	})

	return p
}
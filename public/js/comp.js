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
    			{ 'name': 'POI', 'val': 'poi' },
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
    			if (!this.isRangeValid()) {
    				return false;
    			}

				let self = this
				
    			mapins.panTo( regionRecords[city]['center'] )
                document.getElementsByTagName('body')[0].classList.add('loading');
    			getEntropy(city, self.selections.etype, self.selections.eVal).then(function(res) {
                    document.getElementsByTagName('body')[0].classList.remove('loading');
    				self.params.range.max = Number.parseFloat(res['prop']['maxVal'])
    				
    				let valRange = commonFunc.getValRange(self.params.range, self.selections.eVal)

				  	mapins.mapgridCDrawing(res, valRange)
				}).catch(function(err) {
				  	console.error("Failed!", err);
				});
    		} else {
    			alert('Beijing is not available now, please try another region and update again.')
    		}
    	},
    	'getDensityOverview': function() {
    		let city = this.selections.city
    		if (city !== 'bj') {
    			let self = this
				
    			mapins.panTo( regionRecords[city]['center'] )

                document.getElementsByTagName('body')[0].classList.add('loading');
    			getDensity(city, self.selections.etype, self.selections.eVal).then(function(res) {
                    document.getElementsByTagName('body')[0].classList.remove('loading');
    				self.params.range.max = Number.parseFloat(res['prop']['maxVal'])

    				let valRange = commonFunc.getValRange(self.params.range, self.selections.eVal)
				  	mapins.mapgridCDrawing(res, valRange)
				}).catch(function(err) {
				  	console.error("Failed!", err);
				});
    		} else {
    			alert('Beijing is not available now, please try another region and update again.')
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
    	},
    	'isActive': function(val) {
    		if (val === this.selections.city) {
    			return 'selectedregion'
    		} else {
    			return ''
    		}
    	},
    	'isRangeValid': function() {
    		if (this.selections.eVal.min >= this.selections.eVal.max) {
    			alert('The minVal should not be larger than maxVal. Please do it again.');
    			this.selections.eVal.min = 0
    			this.selections.eVal.max = 1
    			return false;
    		}

    		return true;
    	}
    },
    // computed: {

    // },
    // watch: {
    // 	'selections.eVal.min': {
    // 		handler: function(val) {
    // 			if (this.selections.eVal.min >= this.selections.eVal.max) {
	   //  			// alert('The minVal should not be larger than maxVal. Please do it again.');
	   //  			this.selections.eVal.min = 0
	   //  			return ;
	   //  		}
    // 		},
    // 		immediate: false
    // 	},
    // 	'selections.eVal.max': {
    // 		handler: function(val) {
    // 			if (this.selections.eVal.min >= this.selections.eVal.max) {
	   //  			alert('The minVal should not be larger than maxVal. Please do it again.');
	   //  			this.selections.eVal.max = 1
	   //  			return ;
	   //  		}
    // 		},
    // 		immediate: false
    // 	}
    // },
    mounted() {
    	this.$nextTick(function () {
			this.getEntropyOverview()
		})
    }
})

let commonFunc = (function() {
	return {
		'getValRange': function(base, selections) {
			return {
				'min': base.min+selections.min * Number.parseFloat(base.max-base.min),
				'max': base.min+selections.max * Number.parseFloat(base.max-base.min)
			}
		}
	}
})();

let getEntropy = function(city, type, eprop) {
	let p = new Promise(function(resolve, reject) {
		$.get(`/comp/overviewEQuery?city=${city}&etype=${type}&ctype=p&emin=${eprop['min']}&emax=${eprop['max']}`, function(res, err) {
			if (res['scode']) {
				resolve(res['data'])
			} else {
				reject(err)
			}
		})
	});

	return p
}

let getDensity = function(city, type, eprop) {
	let p = new Promise(function(resolve, reject) {
		if (type === 'poi') {
			type = 'v'
		} else {
			type = 'w'
		}
		$.get(`/comp/overviewDQuery?city=${city}&type=${type}&ctype=p&emin=${eprop['min']}&emax=${eprop['max']}`, function(res, err) {
			if (res['scode']) {
				resolve(res['data'])
			} else {
				reject(err)
			}
		})
	});

	return p
}
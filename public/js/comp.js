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
// window.jQuery = $
import {regionRecords} from './components/initdata'
import {getEntropy, getDensity, getValRange} from './components/apis'

// Vue.use(Vuex)

let mapins = new mapview('map');

// const store = new Vuex.Store({
//   state: {
// 	'drawData': {}
//   },
//   mutations: {
//     updateCity (data) {
//       state.drawData = data
//     }
//   }
// })

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
    			{ 'name': 'POI', 'val': 'p' },
    			{ 'name': 'Admin Division', 'val': 'a' },
    			{ 'name': 'Time Periods', 'val': 't' }
    		],
    		'ctypes': [
    			{ 'name': 'People Entropy', 'val': 'p' },
    			{ 'name': 'Record Entropy', 'val': 'r' }
    		],
    		'range': {
    			'min': 0,
    			'max': 1.79
    		}
    	},
    	'selections': {
    		'city': 'tj',
    		'etype': 'p',
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
    		if (city !== 'bj' && city !== 'ts') {
    			if (!this.isRangeValid()) {
    				return false;
    			}

				let self = this;
				
    			mapins.panTo( regionRecords[city]['center'] )
                document.getElementsByTagName('body')[0].classList.add('loading');
                console.log('Begin to get data from server.');
                console.time('SERVER');

                // basicGetOverview(city, self);

    			getEntropy(self.selections).then(function(res) {
    				console.log('Already got data from server.');
    				console.timeEnd('SERVER');
                    document.getElementsByTagName('body')[0].classList.remove('loading');
    				self.params.range.max = Number.parseFloat(res['prop']['maxVal']);
    				
    				let valRange = getValRange(self.params.range, self.selections.eVal)

				  	mapins.mapgridCDrawing(res, valRange)
				}).catch(function(err) {
				  	console.error("Failed!", err);
				});
    		} else {
    			alert('Beijing and Tangshan are not available now, please try another region and update again.')
    		}
    	},
    	'getDensityOverview': function() {
    		let city = this.selections.city
    		if (city !== 'bj' && city !== 'ts') {
    			let self = this
				
    			mapins.panTo( regionRecords[city]['center'] )

                document.getElementsByTagName('body')[0].classList.add('loading');
    			getDensity(self.selections).then(function(res) {
                    document.getElementsByTagName('body')[0].classList.remove('loading');
    				self.params.range.max = Number.parseFloat(res['prop']['maxVal']);
    				// self.results.drawData = res;

    				let valRange = getValRange(self.params.range, self.selections.eVal)
				  	mapins.mapgridCDrawing(res, valRange)
				}).catch(function(err) {
				  	console.error("Failed!", err);
				});
    		} else {
    			alert('Beijing and Tangshan are not available now, please try another region and update again.')
    		}
    	},
    	'regionImgUrl': function(city) {
    		return `/assets/${city}-icon.png`
    	},
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

// let commonFunc = (function() {
// 	return {
// 		'getValRange': function(base, selections) {
// 			return {
// 				'min': base.min+selections.min * Number.parseFloat(base.max-base.min),
// 				'max': base.min+selections.max * Number.parseFloat(base.max-base.min)
// 			}
// 		}
// 	}
// })();

// let getEntropy = function(sels) {
// 	let city = sels.city,
// 		etype = sels.etype,
// 		ctype = sels.ctype,
// 		emin = sels.eVal.min,
// 		emax = sels.eVal.max;

// 	let p = new Promise(function(resolve, reject) {
// 		$.get(`/comp/overviewEQuery?city=${city}&etype=${etype}&ctype=${ctype}&emin=${emin}&emax=${emax}`, function(res, err) {
// 			if (res['scode']) {
// 				resolve(res['data'])
// 			} else {
// 				reject(err)
// 			}
// 		})
// 	});

// 	return p
// };

// let getDensity = function(sels) {
// 	let city = sels.city,
// 		etype = sels.etype,
// 		ctype = sels.ctype,
// 		emin = sels.eVal.min,
// 		emax = sels.eVal.max;

// 	let p = new Promise(function(resolve, reject) {
// 		if (etype === 'p') {
// 			etype = 'v'
// 		} else {
// 			etype = 'w'
// 		}
// 		$.get(`/comp/overviewDQuery?city=${city}&etype=${etype}&ctype=${ctype}&emin=${emin}&emax=${emax}`, function(res, err) {
// 			if (res['scode']) {
// 				resolve(res['data'])
// 			} else {
// 				reject(err)
// 			}
// 		})
// 	});

// 	return p
// };
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
import {regionRecords, comp} from './components/initdata'
import {getOverview, getDensity, getValRange} from './components/apis'
import vueSlider from 'vue-slider-component'

// Vue.use(Vuex)

let mapins = new mapview('map');

const userpanel = new Vue({
	el: '#userpanel',
	data: comp,
	components: {
		vueSlider
	},
	methods: {
		'getEntropyOverview': function() {
			let city = this.selections.city
			if (city !== 'bj' && city !== 'ts') {
				// if (!this.isRangeValid()) {
				// 	return false;
				// }

				let self = this;
				
				mapins.panTo( regionRecords[city]['center'] )
				document.getElementsByTagName('body')[0].classList.add('loading');
				console.log('Begin to get data from server.');
				console.time('SERVER');

				// basicGetOverview(city, self);

				getOverview(self.selections).then(function(res) {
					console.log('Already got data from server.');
					console.timeEnd('SERVER');
					document.getElementsByTagName('body')[0].classList.remove('loading');
					self.params.scales.entropy = res['prop']['emax'];
					self.params.scales.density = res['prop']['dmax'];
					
					let valScales = getValRange(self.params.scales, self.components.eSlider.value, self.components.dSlider.value);
					valScales['type'] = 'entropy';

					mapins.mapgridCDrawing(res, valScales)
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
				getOverview(self.selections).then(function(res) {
					document.getElementsByTagName('body')[0].classList.remove('loading');
					self.params.scales.entropy = res['prop']['emax'];
					self.params.scales.density = res['prop']['dmax'];

					let valScales = getValRange(self.params.scales, self.components.eSlider.value, self.components.dSlider.value);
					valScales['type'] = 'density';

					mapins.mapgridCDrawing(res, valScales)
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
		// 'isRangeValid': function() {
		// 	if (this.selections.eVal.min >= this.selections.eVal.max) {
		// 		alert('The minVal should not be larger than maxVal. Please do it again.');
		// 		this.selections.eVal.min = 0
		// 		this.selections.eVal.max = 1
		// 		return false;
		// 	}

		// 	return true;
		// },
		'computedSliderCSS': function(type) {
			let v = this.components.eSlider.value;
			if (type === 'd') {
				v = this.components.dSlider.value;
			}
			// console.log('v:', v);
			document.getElementById(`${type}Slider`).getElementsByClassName('vue-slider')[0].style.background = `-webkit-repeating-linear-gradient(left, white 0%, white ${v[1]-0.01}%, red ${v[1]}%, red 100%)`;
		}
	},
	// computed: {
	//     'computedSliderCSS': function() {
	//         return {
	//             'background': '-webkit-repeating-linear-gradient(white, red ${this.params.range.val[1]}%, red 100%)'
	//         }
	//     }
	// },
	watch: {
		'components.slider.value': {
			handler: function(val, OldVal) {
				// let v = this.components.slider.value;
				// document.getElementById('rangeSlider').getElementsByClassName('vue-slider')[0].style.background = '-webkit-repeating-linear-gradient(white, white ${v[0]}%, red ${v[1]}%, red 100%)';
				// $('#rangeSlider .vue-slider').css('background', '-webkit-repeating-linear-gradient(white, white ${this.params.range.val[0]}%, red ${val}%, red 100%)');
			},
			deep: true
		}
	},
	mounted() {
		this.$nextTick(function () {
			// this.getEntropyOverview();
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
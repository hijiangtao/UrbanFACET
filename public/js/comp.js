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
import {getOverviewDatasets, getDensity, getValRange} from './components/apis'
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
		'getOverview': function(typeval) {
			let city = this.selections.city;
			if (city !== 'bj') {
				let self = this;
				
				self.selections.initialstate = true;
				mapins.panTo( regionRecords[city]['center'] );
				document.getElementById('map').classList.add('loading');
				console.log('Begin to get data from server.');
				console.time('SERVER');

				getOverviewDatasets(self.selections).then(function(res) {
					console.log('Already got data from server.');
					console.timeEnd('SERVER');
					document.getElementById('map').classList.remove('loading');

					self.params.scales.entropy = Math.log(res['prop']['emax']+1);
					self.params.scales.density = Math.log(res['prop']['dmax']+1);
					
					let valScales = getValRange(self.params.scales, self.components.eSlider.value, self.components.dSlider.value);
					valScales['type'] = typeval;

					mapins.mapgridCDrawing(res, valScales)
				}).catch(function(err) {
					console.error("Failed!", err);
				});
			} else {
				alert('Beijing is not available now, please try another region and update again.')
			}
		},
		// 'getDensityOverview': function() {
		// 	let city = this.selections.city
		// 	if (city !== 'bj') {
		// 		let self = this
				
		// 		mapins.panTo( regionRecords[city]['center'] );

		// 		document.getElementsByTagName('body')[0].classList.add('loading');
		// 		getOverview(self.selections).then(function(res) {
		// 			document.getElementsByTagName('body')[0].classList.remove('loading');
		// 			self.params.scales.entropy = res['prop']['emax'];
		// 			self.params.scales.density = res['prop']['dmax'];

		// 			let valScales = getValRange(self.params.scales, self.components.eSlider.value, self.components.dSlider.value);
		// 			valScales['type'] = 'density';

		// 			mapins.mapgridCDrawing(res, valScales)
		// 		}).catch(function(err) {
		// 			console.error("Failed!", err);
		// 		});
		// 	} else {
		// 		alert('Beijing are not available now, please try another region and update again.')
		// 	}
		// },
		// 'regionImgUrl': function(city) {
		// 	return `/assets/${city}-icon.png`
		// },
		'updateSelectRegion': function(val) {
			for (let i = this.params.regions.length - 1; i >= 0; i--) {
				if (this.params.regions[i].val !== val) {
					this.params.regions[i].active = false;
				} else {
					this.params.regions[i].active = true;
				}
				
			}

			this.selections.city = val;
		},
		// 'isActive': function(val) {
		// 	if (val === this.selections.city) {
		// 		return 'selectedregion'
		// 	} else {
		// 		return ''
		// 	}
		// },
		// 'isRangeValid': function() {
		// 	if (this.selections.eVal.min >= this.selections.eVal.max) {
		// 		alert('The minVal should not be larger than maxVal. Please do it again.');
		// 		this.selections.eVal.min = 0
		// 		this.selections.eVal.max = 1
		// 		return false;
		// 	}

		// 	return true;
		// },
		'computedSlider': function(type) {
			let self = this,
				v = this.components.eSlider.value;
			if (type === 'd') {
				v = this.components.dSlider.value;
			}
			// console.log('v:', v);
			document.getElementById(`${type}Slider`).getElementsByClassName('vue-slider')[0].style.background = `-webkit-repeating-linear-gradient(left, white 0%, white ${v[1]-0.01}%, red ${v[1]}%, red 100%)`;

			let valScales = getValRange(self.params.scales, self.components.eSlider.value, self.components.dSlider.value);

			mapins.mapgridCDrawing({}, valScales, true);
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
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
import chart from './components/chartview'
import $ from "jquery"
// window.jQuery = $
import {regionRecords, comp} from './components/initdata'
import {getOverviewDatasets, getDensity, getValRange} from './components/apis'
import vueSlider from 'vue-slider-component'

require('../../semantic/dist/components/tab')

// Vue.use(Vuex)

// 判断浏览器是否支持 localStorage
if (typeof(Storage) === undefined) {
    alert('Please Update your browser to support localStorage');
}

let mapins = new mapview('map'),
	chartins = new chart('#estatChart');

const userpanel = new Vue({
	el: '#userpanel',
	data: comp,
	components: {
		vueSlider
	},
	methods: {
		'getOverview': function(typeval='') {
			let city = this.selections.city;
			if (city !== 'bj') {
				if (typeval !== '') {
					this.selections.displaytype = typeval;
				}
				let self = this,
					distype = self.selections.displaytype;

				self.selections.initialstate = false;
				mapins.panTo( regionRecords[city]['center'] );
				document.getElementById('map').classList.add('loading');
				console.log('Begin to get data from server.');
				console.time('SERVER');
				console.log('DisplayType: ', distype);

				getOverviewDatasets(self.selections).then(function(res) {
					console.log('Already got data from server.');
					console.timeEnd('SERVER');
					document.getElementById('map').classList.remove('loading');

					self.params.scales.entropy = res['prop']['emax'];
					self.params.scales.density = res['prop']['dmax'];
					
					let valScales = getValRange(self.params.scales, self.components.eSlider.value, self.components.dSlider.value, self.selections);

					console.log('entropy range', valScales['entropy']);
					
					if (self.selections.contourmap) {
						mapins.mapcontourCDrawing(res, valScales);
					} else {
						mapins.mapgridCDrawing(res, valScales, false, self.selections.splitgridmap, false);
					}

					chartins.brushDraw('#estatChart', res['chart']['e']);
					chartins.brushDraw('#dstatChart', res['chart']['d']);
				}).catch(function(err) {
					console.error("Failed!", err);
				});
			} else {
				alert('Beijing is not available now, please try another region and update again.');
			}
		},
		'updateSelectRegion': function(val) {
			// mapins.drawGridLegend();
			for (let i = this.params.regions.length - 1; i >= 0; i--) {
				if (this.params.regions[i].val !== val) {
					this.params.regions[i].active = false;
				} else {
					this.params.regions[i].active = true;
				}
			}

			this.selections.city = val;
		},
		'updateTPFilter': function(val) {
			// 和之前选择一致,逻辑为取消
			if (this.selections.ftpval === val) {
				val = '';
			}

			for (let i = this.params.tpfilters.length - 1; i >= 0; i--) {
				if (this.params.tpfilters[i].val !== val) {
					this.params.tpfilters[i].active = false;
				} else {
					this.params.tpfilters[i].active = true;
				}
			}

			this.selections.ftpval = val;

			if (this.selections.tpfilter) {
				this.getOverview();
			}
		},
		'computedSlider': function(type) {
			let self = this,
				v = this.components.eSlider.value,
				distype = self.selections.displaytype;
			if (type === 'd') {
				v = this.components.dSlider.value;
			}

			document.getElementById(`${type}Slider`).getElementsByClassName('vue-slider')[0].style.background = `-webkit-repeating-linear-gradient(left, white 0%, white ${v[1]-0.01}%, red ${v[1]}%, red 100%)`;

			let valScales = getValRange(self.params.scales, self.components.eSlider.value, self.components.dSlider.value, self.selections);

			console.log('entropy range', valScales['entropy']);

			if (self.selections.contourmap) {
				mapins.mapcontourCDrawing({}, valScales, true);
			} else {
				mapins.mapgridCDrawing({}, valScales, true, self.selections.splitgridmap, false);
			}
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
		'selections.tpfilter': {
			handler: function(val, OldVal) {
				if (!val) {
					for (let i = this.params.tpfilters.length - 1; i >= 0; i--) {
						this.params.tpfilters[i].active = false;
					}

					this.selections.ftpval = '';
				}
			}
		},
		'selections.dtype': {
			handler: function(val, OldVal) {
				console.log('Value of dtype has changed.');
				if (this.selections.initialstate) {
					return ;
				}

				let self=this,
					valScales = getValRange(self.params.scales, self.components.eSlider.value, self.components.dSlider.value, self.selections);

				if (self.selections.contourmap) {
					mapins.mapcontourCDrawing({}, valScales, true);
				} else {
					mapins.mapgridCDrawing({}, valScales, true, self.selections.splitgridmap, false);
				}
			},
			deep: false
		}
	},
	mounted() {
		this.$nextTick(function () {
			$('.menu .item').tab();
		})
	}
});


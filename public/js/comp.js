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
import { regionRecords, comp } from './components/init'
import { getOverviewDatasets, getDensity, getValRange } from './components/apis'
import vueSlider from 'vue-slider-component'

// require('../../semantic/dist/components/tab')

// Vue.use(Vuex)

// 判断浏览器是否支持 localStorage
if (typeof(Storage) === undefined) {
	alert('Please Update your browser to support localStorage');
}

let maps = new Array(4),
	charts = new Array(4);

const userpanel = new Vue({
	el: '#userpanel',
	data: comp,
	components: {
		vueSlider
	},
	methods: {
		'getOverview': function(index) {
			// 当前 index 不在合法的阈值范围内
			let self = this,
				esvals = self.components.eSlider.value,
				dsvals = self.components.dSlider.value;
			index = Number.parseInt(index);
			self.sels.lstindex = index;
			if (index > 3) {
				alert('Selected object is out of index.');
			}

			// 判断是单个对象绘制还是多个对象绘制, 多对象 index 值为 -1
			if (index === -1) {

			} else {
				let sels = self.sels.objs[index],
					city = sels.city;

				document.getElementById(sels.id.map).classList.add('loading');
				console.log('Connecting server.');

				getOverviewDatasets(sels).then(function(res) {
					console.log('Got server data.');
					document.getElementById(sels.id.map).classList.remove('loading');

					sels.scales = res['prop']['scales'];

					let valScales = getValRange(sels.scales, esvals, dsvals, self.sels, index);
					console.log('valScales', valScales);

					switch (self.sels.ctrmap) {
						case true:
							maps[index].mapcontourCDrawing(res, valScales);
							break;
						case false:
							maps[index].mapgridCDrawing(res, valScales, false, self.sels.splitmap, false);
							break;
						default:
							break;
					}

					charts[index].brushDraw(`#estatChart${index}`, res['chart']['e']);
					charts[index].brushDraw(`#dstatChart${index}`, res['chart']['d']);
					maps[index].panTo(regionRecords[city]['center']);
				}).catch(function(err) {
					console.error("Failed!", err);
				});

			}
		},
		'updateSelectRegion': function(index, val) {
			this.sels.objs[index].city = val;
		},
		'updateTPFilter': function(val, index) {
			// 如果初始化操作未曾进行,此方法直接返回结果不做更新操作
			let self = this,
				sels = self.sels.objs[index];
			
			index = Number.parseInt(index);
			if (this.sels.lstindex === -999) {
				return;
			}

			// 和之前选择一致,逻辑为取消
			if (sels.ftpval === val) {
				sels.ftpval = '';
			} else {
				sels.ftpval = val;
			}

			this.getOverview(index);
		},
		'updateDS': function(index, val) {
			// 如果初始化操作未曾进行,此方法直接返回结果不做更新操作
			index = Number.parseInt(index);
			this.sels.objs[index].dtype = val;

			if (this.sels.lstindex === -999) {
				return;
			}

			let self = this,
				sels = self.sels.objs[index],
				esvals = self.components.eSlider.value,
				dsvals = self.components.dSlider.value,
				valScales = getValRange(sels.scales, esvals, dsvals, self.sels, index);

			switch (self.sels.ctrmap) {
				case true:
					maps[index].mapcontourCDrawing({}, valScales, true);
					break;
				case false:
					maps[index].mapgridCDrawing({}, valScales, true, self.sels.splitmap, false);
					break;
				default:
					break;
			}
		},
		'computedSlider': function(type) {
			// 定位 slider
			let v = this.components.eSlider.value;
			if (type === 'd') {
				v = this.components.dSlider.value;
			}

			// 改变背景色
			document.getElementById(`${type}Slider`).getElementsByClassName('vue-slider')[0].style.background = `-webkit-repeating-linear-gradient(left, white 0%, white ${v[1]-0.01}%, red ${v[1]}%, red 100%)`;

			// 如果初始化操作未曾进行,此方法直接返回结果不做更新操作
			let index = this.sels.lstindex;
			if (index === -999) {
				return;
			}

			let self = this,
				sels = self.sels.objs[index],
				esvals = self.components.eSlider.value,
				dsvals = self.components.dSlider.value,
				valScales = getValRange(sels.scales, esvals, dsvals, self.sels, index);

			console.log('entropy range', valScales['e']);
			switch (self.sels.ctrmap) {
				case true:
					maps[index].mapcontourCDrawing({}, valScales, true);
					break;
				case false:
					maps[index].mapgridCDrawing({}, valScales, true, self.sels.splitmap, false);
					break;
				default:
					break;
			}
		}
	},
	watch: {
		/**
		 * 如果展示的数据类型变化,则更新视图
		 */
		'selections.dtype': {
			handler: function(val, OldVal) {
				console.log('dtype changed.');
				// 如果初始化操作未曾进行,此方法直接返回结果不做更新操作
				let index = this.sels.lstindex;
				if (index === -999) {
					return;
				}

				let self = this,
					sels = self.sels.objs[index],
					esvals = self.components.eSlider.value,
					dsvals = self.components.dSlider.value,
					valScales = getValRange(sels.scales, esvals, dsvals, self.sels, index);

				console.log('entropy range', valScales['entropy']);
				switch (self.sels.ctrmap) {
					case true:
						maps[index].mapcontourCDrawing({}, valScales, true);
						break;
					case false:
						maps[index].mapgridCDrawing({}, valScales, true, self.sels.splitmap, false);
						break;
					default:
						break;
				}
			},
			deep: false
		}
	},
	mounted() {
		this.$nextTick(function() {
			maps[0] = new mapview('map0', 'gridmaplegend0', 'contourmaplegend0');
			charts[0] = new chart('#estatChart0');
		})
	}
});

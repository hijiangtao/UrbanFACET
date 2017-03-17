/**
 * comp.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-02-12 16:21:47
 * @version $Id$
 */

'use strict'

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import mapview from './components/xmap-view'
import chart from './components/chartview'
import $ from "jquery"
// window.jQuery = $
import { regionRecords, comp } from './components/init'
import { getOverviewDatasets, getDensity, getValRange, objClone } from './components/apis'
import { appendMap, removeMaps } from './components/events'
import vueSlider from 'vue-slider-component'

// Vuex Instance
const store = new Vuex.Store({
  state: {
    init: true
  },
  mutations: {
    updateInitState (state) {
      state.init = !state.init;
    }
  }
})

// 判断浏览器是否支持 localStorage
if (typeof(Storage) === undefined) {
	alert('Please Update your browser to support localStorage');
}

let maps = [],
	charts = [];

// let bindTabClick = function() {
// 	let self = this,
// 		panelId = self.getAttribute('data-tab');

// 	iterateTabs(self.id, panelId);
// }

const userpanel = new Vue({
	el: '#main',
	data: comp,
	store,
	components: {
		vueSlider
	},
	methods: {
		/**
		 * 从服务器拉取 entropy 以及 density 数据并显示在相应 map 板块
		 * @param  {[type]} index map 面板编号
		 * @return {[type]}       [description]
		 */
		'getOverview': function(index) {
			// 当前 index 不在合法的阈值范围内
			let self = this,
				esvals = self.components.eSlider.value,
				dsvals = self.components.dSlider.value;
			
			index = Number.parseInt(index);

			if (index > 3) {
				alert('Selected object is out of index.');
			}

			// 判断是单个对象绘制还是多个对象绘制, 多对象 index 值为 -1
			if (index === -1) {
				let objs = self.sels.objs;

				for (let i = objs.length - 1; i >= 0; i--) {
					let obj = objs[i],
						city = obj.city;

					document.getElementById(obj.id.map).parentNode.classList.add('loading');

					getOverviewDatasets(obj).then(function(res) {
						document.getElementById(obj.id.map).parentNode.classList.remove('loading');

						obj.scales = res['prop']['scales'];

						let valScales = getValRange(obj.scales, esvals, dsvals, self.sels, i);
						console.log('valScales', valScales);

						maps[i].panTo(regionRecords[city]['center']);
						switch (self.sels.ctrmap) {
							case true:
								maps[i].mapcontourCDrawing(res, valScales);
								break;
							case false:
								maps[i].mapgridCDrawing(res, valScales, false, self.sels.splitmap, false);
								break;
							default:
								break;
						}

						charts[i].brushDraw(`#estatChart${i}`, res['chart']['e']);
						charts[i].brushDraw(`#dstatChart${i}`, res['chart']['d']);
					}).catch(function(err) {
						console.error("Failed!", err);
					});
				}
			} else {
				// this.sels.lstindex = index;

				let sels = self.sels.objs[index],
					city = sels.city;

				document.getElementById(sels.id.map).parentNode.classList.add('loading');
				console.log('Connecting server.');

				getOverviewDatasets(sels).then(function(res) {
					console.log('Got server data.');
					document.getElementById(sels.id.map).parentNode.classList.remove('loading');

					sels.scales = res['prop']['scales'];

					let valScales = getValRange(sels.scales, esvals, dsvals, self.sels, index);
					console.log('valScales', valScales);

					maps[index].panTo(regionRecords[city]['center']);
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

				}).catch(function(err) {
					console.error("Failed!", err);
				});
			}

			// 改变页面初始化状态
			if (store.state.init) {
				store.commit('updateInitState');
			}
		},
		'getOverlay': function(index) {
			index = Number.parseInt(index);

			let prop = {
				'city': this.sels.objs[index].city,
				'type': Number.parseInt( this.sels.objs[index].otype )
			}
			maps[index].boundaryDrawing({}, prop);
		},
		/**
		 * 更新指定 map 面板中选中的 City
		 * @param  {[type]} index [description]
		 * @param  {[type]} val   [description]
		 * @return {[type]}       [description]
		 */
		'updateSelectRegion': function(index, val) {
			this.sels.objs[index].city = val;
		},
		/**
		 * 更新指定 map 面板中的时间过滤条件
		 * @param  {[type]} val   [description]
		 * @param  {[type]} index [description]
		 * @return {[type]}       [description]
		 */
		'updateTPFilter': function(val, index) {
			// 如果初始化操作未曾进行,此方法直接返回结果不做更新操作
			let self = this,
				sels = self.sels.objs[index];
			
			// 和之前选择一致,逻辑为取消
			if (sels.ftpval === val) {
				sels.ftpval = '';
			} else {
				sels.ftpval = val;
			}

			index = Number.parseInt(index);
			// this.sels.lstindex = index;
			if (store.state.init) {
				return;
			}

			this.getOverview(index);
		},
		/**
		 * 更新数据的 display type
		 * @param  {[type]} index [description]
		 * @param  {[type]} val   [description]
		 * @return {[type]}       [description]
		 */
		'updateDS': function(index, val) {
			// 如果初始化操作未曾进行,此方法直接返回结果不做更新操作
			index = Number.parseInt(index);
			// this.sels.lstindex = index;

			if (store.state.init) {
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
		/**
		 * 计算与更新 slider 样式, 更新 map
		 * @param  {[type]} type 传入的 slider 类型值, d/e
		 * @return {[type]}      [description]
		 */
		'updateSlider': function(type, index) {
			// 定位 slider
			let v = this.components.eSlider.value;
			if (type === 'd') {
				v = this.components.dSlider.value;
			}

			// 改变背景色
			document.getElementById(`${type}Slider`).getElementsByClassName('vue-slider')[0].style.background = `-webkit-repeating-linear-gradient(left, white 0%, white ${v[1]-0.01}%, red ${v[1]}%, red 100%)`;

			// 如果初始化操作未曾进行,此方法直接返回结果不做更新操作
			index = Number.parseInt(index);
			// this.sels.lstindex = index;
			if (store.state.init) {
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
		},

		'addAnaObj': function() {
			let self = this,
				currentSize = self.sels.objs.length;
			console.log('currentSize', currentSize);
			self.sels.lstnum = currentSize;

			switch (currentSize) {
				// 添加一个对象
				case 1:
				appendMap( [1] );
				self.updateSels(1, 'add');
				break;
				// 复制现有两个对象并添加
				case 2:
				appendMap( [2,3] );
				self.updateSels(2, 'add');
				break;
				case 4:
				alert('No more objects can be created, please remove some first.');
				break;
				default:
				break;
			}

			// for (let i = currentSize*2 - 1; i >= currentSize; i--) {
			// 	// 新建 map & chart model view
			// 	maps[i] = new mapview(`map${i}`, `gridmaplegend${i}`, `contourmaplegend${i}`);
			// 	charts[i] = new chart(`#estatChart${i}`);

			// 	// 更新 objs 中的 id 对象
			// 	self.sels.objs[i].id.card = `card${i}`;
			// 	self.sels.objs[i].id.map = `map${i}`;
			// 	self.sels.objs[i].id.tab = `tab${i}`;

			// 	// 更新视图
			// 	self.getOverview(i);
			// 	// setTimeout(self.getOverview(i), 1000);
			// }

			// // 非同步操作: 将视图聚焦切换到最新的 tab 上
			// iterateTabs(`switch${maps.length-1}`, `tab${maps.length-1}`);
		},
		'delAnaObj': function() {
			let self = this,
				currentSize = self.sels.objs.length;
			self.sels.lstnum = currentSize;

			switch (currentSize) {
				// 删除两个对象
				case 4:
				// removeMaps(2);
				self.updateSels(2, 'del');
				maps.splice(-2,2);
				charts.splice(-2,2);
				break;
				// 删除一个对象
				case 2:
				// removeMaps(1);
				self.updateSels(1, 'del');
				maps.splice(-1,1);
				charts.splice(-1,1);
				break;
				case 1:
				alert('No more objects can be removed, one object should be reserved in the page.');
				break;
				default:
				break;
			}

			// for (let i = currentSize - 1; i >= Number.parseInt( currentSize/2 ); i--) {
			// 	maps.splice(-1,1);
			// 	charts.splice(-1,1);
			// }

			this.sels.lstindex = 0;
		},
		/**
		 * 更新 vue 实例中存储的 objs 数组, isize 为个数
		 * @param  {[type]} isize [description]
		 * @param  {[type]} type  [description]
		 * @return {[type]}       [description]
		 */
		'updateSels': function(isize, type) {
			let self = this;

			for (let i=0; i<isize; i++) {
				switch (type) {
					case 'add':
					self.sels.objs.push( objClone( self.sels.objs[i] ) );
					break;
					default:
					self.sels.objs.splice(-1, 1);
					break;
				}
			}
		},
		'getTabImg': function(val, type) {
			let cities = {
				'bj': 0,
				'tj': 1,
				'zjk': 2,
				'ts': 3
			}

			return this.params.regions[`${type}url`];
		},
		'bindTabClick': function(val) {
			this.sels.lstindex = val;
		}
	},
	computed: {
		mapClass: function() {
			switch (this.sels.objs.length) {
				case 1:
				return 'onemap';
				break;
				case 2:
				return 'twomap';
				break;
				default:
				return 'formap';
				break;
			}
		}
	},
	watch: {
		/**
		 * 如果展示的数据类型变化,则更新视图
		 */
		'sels.dtype': {
			handler: function(val, OldVal) {
				console.log('dtype changed.');
				// 如果初始化操作未曾进行,此方法直接返回结果不做更新操作
				let index = this.sels.lstindex;
				if (store.state.init) {
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
		let self = this;
		this.$nextTick(function() {
			maps[0] = new mapview('map0', 'gridmaplegend0', 'contourmaplegend0');
			charts[0] = new chart('#estatChart0');

			// document.getElementById( `switch0` ).addEventListener('click', bindTabClick);

			// maps[0].drawGeojson('tj');
		});
	},
	updated() {
		let self = this,
			curnum = self.sels.objs.length,
			lstnum = self.sels.lstnum;

		if (curnum > lstnum) {
			for (let i = curnum - 1; i >= lstnum; i--) {
				// 新建 map & chart model view
				maps[i] = new mapview(`map${i}`, `gridmaplegend${i}`, `contourmaplegend${i}`);
				charts[i] = new chart(`#estatChart${i}`);

				// 更新 objs 中的 id 对象
				self.sels.objs[i].id.card = `card${i}`;
				self.sels.objs[i].id.map = `map${i}`;
				self.sels.objs[i].id.tab = `tab${i}`;

				// 更新视图
				self.getOverview(i);
			}

			// 非同步操作: 将视图聚焦切换到最新的 tab 上
			// iterateTabs(`switch${maps.length-1}`, `tab${maps.length-1}`);

			self.sels.lstnum = curnum;
			self.sels.lstindex = curnum-1;
		}
	}
});

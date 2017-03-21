/**
 * home.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-03-17 10:00:09
 * @version $Id$
 */

'use strict'

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import mapview from './components/hmap-view'
import chart from './components/chartview'
import $ from "jquery"
// window.jQuery = $
import { regionRecords, home } from './components/init'
import { getOverviewDatasets, getBoundaryDatasets, getAOIDatasets, getDensity, getDrawProps, objClone } from './components/apis'
import { appendMap, removeMaps } from './components/events'
import vueSlider from 'vue-slider-component'

// Vuex Instance
const store = new Vuex.Store({
	state: {
		init: true
	},
	mutations: {
		updateInitState(state) {
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

const userpanel = new Vue({
	el: '#main',
	data: home,
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
			let self = this,
				svals = self.components.eSlider.value;

			index = Number.parseInt(index);

			// 当前 index 不在合法的阈值范围内
			if (index > 3) {
				alert('Selected object is out of index.');
			}

			// 判断是单个对象绘制还是多个对象绘制, 多对象 index 值为 -1
			let objs = self.sels.objs;

			for (let i = objs.length - 1; i >= 0; i--) {
				if (index !== -1) {
					i = Number.parseInt(index);
				}

				let obj = objs[i],
					city = obj.city,
					etype = obj.etype;

				// 添加 loading 效果 & 移动地图
				document.getElementById(obj.id.map).parentNode.classList.add('loading');
				maps[i].panTo(regionRecords[city]['center']);

				console.log(etype in ['pp', 'pd', 'rp', 'rd', 'de']);
				// 根据用户所选 metric 类型进行相应数据提取操作
				if (['pp', 'pd', 'rp', 'rd', 'de'].indexOf(etype) > -1) {
					// 获取 entropy 和 density 资源
					getOverviewDatasets(obj).then(function(res) {
						document.getElementById(obj.id.map).parentNode.classList.remove('loading');

						// 更新最大值域范围
						obj.scales = res['prop']['scales'];

						// 获取 slider 情况下的配置值域以及用户其余选项
						let drawProps = getDrawProps(obj.scales, svals, self.sels.ctrsets, etype);
						console.log('drawProps', drawProps);

						maps[i].mapcontourCDrawing(res, drawProps);
					}).catch(function(err) {
						console.error("Failed!", err);
					});
				} else {
					getBoundaryDatasets(city).then(function(res) {
						document.getElementById(obj.id.map).parentNode.classList.remove('loading');

						let prop = {
							'city': city,
							'etype': etype,
							'boundary': false
						};

						maps[i].boundaryDrawing(res, prop);
					}).catch(function(err) {
						console.error("Failed!", err);
					});
				}

				if (index !== -1) {
					break;
				}
			}

			// 改变页面初始化状态
			if (store.state.init) {
				store.commit('updateInitState');
			}
		},
		/**
		 * 更新指定 map 面板中选中的 City
		 * @param  {[type]} index [description]
		 * @param  {[type]} val   [description]
		 * @return {[type]}       [description]
		 */
		'updateSelectRegion': function(val) {
			let objs = this.sels.objs;
			for (let i = objs.length - 1; i >= 0; i--) {
				objs[i].city = val;
			}
		},
		/**
		 * time 动态分析
		 * @return {[type]} [description]
		 */
		'tda': function() {
			
		},
		/**
		 * city 动态分析
		 * @return {[type]} [description]
		 */
		'cda': function() {
			
		},
		/**
		 * 更新指定 map 面板中的时间过滤条件
		 * @param  {[type]} val   [description]
		 * @param  {[type]} index [description]
		 * @return {[type]}       [description]
		 */
		'updateTPFilter': function(val) {
			let objs = this.sels.objs;

			// 和之前选择一致,逻辑为取消
			if (objs[0].ftpval === val) {
				val = '';
			}

			console.log(objs[0].ftpval);

			for (let i = objs.length - 1; i >= 0; i--) {
				objs[i].ftpval = val;
			}

			// 如果初始化操作未曾进行,此方法直接返回结果不做更新操作
			if (!store.state.init) {
				this.getOverview(-1);
			}
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
				valScales = getDrawProps(sels.scales, esvals, dsvals, self.sels, index);

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

			// 改变背景色
			document.getElementById('eSlider').getElementsByClassName('vue-slider')[0].style.background = `-webkit-repeating-linear-gradient(left, white 0%, white ${v[1]-0.01}%, red ${v[1]}%, red 100%)`;

			// 如果初始化操作未曾进行,此方法直接返回结果不做更新操作
			index = Number.parseInt(index);
			// this.sels.lstindex = index;
			if (store.state.init) {
				return;
			}

			let self = this,
				sels = self.sels.objs[index],
				esvals = self.components.eSlider.value;
		},

		'addAnaObj': function() {
			let self = this,
				currentSize = self.sels.objs.length;
			console.log('currentSize', currentSize);
			// self.sels.lstnum = currentSize;

			switch (currentSize) {
				// 添加一个对象
				case 1:
					appendMap([1]);
					self.updateSels(1, 'add');
					break;
					// 复制现有两个对象并添加
				case 2:
					appendMap([2, 3]);
					self.updateSels(2, 'add');
					break;
				case 4:
					alert('No more objects can be created, please remove some first.');
					break;
				default:
					break;
			}

		},
		'delAnaObj': function() {
			let self = this,
				currentSize = self.sels.objs.length;
			// self.sels.lstnum = currentSize;

			switch (currentSize) {
				// 删除两个对象
				case 4:
					// removeMaps(2);
					self.updateSels(2, 'del');
					maps.splice(-2, 2);
					charts.splice(-2, 2);
					break;
					// 删除一个对象
				case 2:
					// removeMaps(1);
					self.updateSels(1, 'del');
					maps[1].unsyncmap(maps[0].getMap());
					maps[0].unsyncmap(maps[1].getMap())
					maps.splice(-1, 1);
					charts.splice(-1, 1);
					break;
				case 1:
					alert('No more objects can be removed, one object should be reserved in the page.');
					break;
				default:
					break;
			}

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

			for (let i = 0; i < isize; i++) {
				switch (type) {
					case 'add':
						self.sels.objs.push(objClone(self.sels.objs[i]));
						break;
					default:
						self.sels.objs.splice(-1, 1);
						break;
				}
			}
		},
		'optAreaSelect': function(index) {
			let state = this.sels.areaselect,
				objs = this.sels.objs;
			if (!state) {
				for (let i = objs.length - 1; i >= 0; i--) {
					maps[i].optAreaSelector(true);
				}

				if (objs.length === 2) {
					console.log(maps[1].getAreaSelect());
					maps[0].bindAreaSelect(maps[1].getAreaSelect());
				}
			} else {
				for (let i = objs.length - 1; i >= 0; i--) {
					maps[i].optAreaSelector(false);
				}
			}
			// 
			this.sels.areaselect = !state;
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
					// if (this.sels.otype === -1) {
					//     return 'onemap';
					// } else {
					//     return 'twomap';
					// }
					return 'onemap';
					break;
				case 2:
					return 'twomap';
					break;
				default:
					return 'formap';
					break;
			}
		},
		// 判断是否开启 area select 功能
		areaselState: function() {
			switch (this.sels.areaselect) {
				case false:
				return 'positive';
				break;
				default:
				return 'negative';
				break;
			}
		}
	},
	watch: {
		'sels.otype': {
			handler: function(val) {
				let index = this.sels.lstindex,
					objs = this.sels.objs;

				// 删除覆盖层
				if (val === -1) {
					for (let i = objs.length - 1; i >= 0; i--) {
						maps[i].boundaryRemove();
					}
					return ;
				}

				for (let i = objs.length - 1; i >= 0; i--) {
					document.getElementById(objs[i].id.map).parentNode.classList.add('loading');
				}
				
				// POI
				if (val === 0) {
					getAOIDatasets(objs[0].city).then(function(res) {
						for (let i = objs.length - 1; i >= 0; i--) {
							let city = objs[i].city,
								etype = objs[i].etype;

							document.getElementById(objs[i].id.map).parentNode.classList.remove('loading');

							// 每个窗口均填充上AOI点分布
							maps[i].aoisDrawing(res);
						}
					}).catch(function(err) {
						console.error("Failed!", err);
					})
				}

				// Districts
				if (val === 1) {
					getBoundaryDatasets(objs[0].city).then(function(res) {
						for (let i = objs.length - 1; i >= 0; i--) {
							let city = objs[i].city,
								etype = objs[i].etype;

							document.getElementById(objs[i].id.map).parentNode.classList.remove('loading');

							let prop = {
								'city': city,
								'etype': etype,
								'boundary': true
							};

							maps[i].boundaryDrawing(res, prop);
						}

						
					}).catch(function(err) {
						console.error("Failed!", err);
					});
				}

				// Density
				if (val === 2) {

				}
			}
		}
	},
	mounted() {
		let self = this;
		this.$nextTick(function() {
			maps[0] = new mapview('map0', 'gridmaplegend0', 'contourmaplegend0');
			charts[0] = new chart('#estatChart0');
		});
	},
	updated() {
		let self = this,
			curnum = self.sels.objs.length,
			lstnum = self.sels.lstnum;

		// maps[0].panBy([1,1]);

		if (curnum !== 4 && curnum !== 6 && curnum > lstnum) {
			for (let i = curnum - 1; i >= lstnum; i--) {
				// 新建 map & chart model view
				maps[i] = new mapview(`map${i}`, `gridmaplegend${i}`, `contourmaplegend${i}`);
				maps[i].syncmap(maps[0].getMap());
				maps[0].syncmap(maps[i].getMap());

				charts[i] = new chart(`#estatChart${i}`);

				// 更新 objs 中的 id 对象
				self.sels.objs[i].id.card = `card${i}`;
				self.sels.objs[i].id.map = `map${i}`;
				self.sels.objs[i].id.tab = `tab${i}`;

				// 更新视图
				self.getOverview(i);
			}

			// 非同步操作: 将视图聚焦切换到最新的 tab 上
			maps[0].invalidateSize();
			maps[1].invalidateSize();

			self.sels.lstnum = curnum;
			self.sels.lstindex = curnum - 1;
		}
	}
});

/**
 * dynamic.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-03-24 15:03:32
 * 可视比较的动态页面交互入口
 */

'use strict'

import Vue from 'vue'
import mapview from './components/hmap-view'
import $ from "jquery"
import { regionRecords, regions, smecAve } from './components/init'
import { getOverviewDatasets, getCompareDatasets, getBoundaryDatasets, getAOIDatasets, getDensity, getDrawProps } from './components/apis'
import { changeLoadState } from './components/events'
import vueSlider from 'vue-slider-component'

// 初始化 dynamic 地图实例
// 地图实例 sync 绑定
// 地图实例对应 slider 设定

const settings = {
	//'whiteToRed': '-webkit-linear-gradient(left, #ffffff 0%,#0000ff 25%,#00ff00 45%,#ffff00 70%,#ff0000 100%)'
		'whiteToRed': '-webkit-linear-gradient(left, #ffffff 0%,#00ff00 30%,#ffff00 55%,#ff0000 100%)'//白、绿、黄、红滑动条
}
class dydata {
	constructor() {
		this.data = {
			'states': {
				'cda': false,
				'tda': false
			},
			'regions': regions,
		    /**
		     * timeblock filters object
		     */
			'tpfilters': [
				{ 'name': 'Morning', 'val': '0', 'aurl': '/assets/tp0-aicon.png', 'nurl': '/assets/tp0-icon.png' },
				{ 'name': 'Forenoon', 'val': '1', 'aurl': '/assets/tp1-aicon.png', 'nurl': '/assets/tp1-icon.png' },
				{ 'name': 'Noon', 'val': '2', 'aurl': '/assets/tp2-aicon.png', 'nurl': '/assets/tp2-icon.png' },
				{ 'name': 'Afternoon', 'val': '3', 'aurl': '/assets/tp3-aicon.png', 'nurl': '/assets/tp3-icon.png' },
				{ 'name': 'Evening', 'val': '4', 'aurl': '/assets/tp4-aicon.png', 'nurl': '/assets/tp4-icon.png' },
				{ 'name': 'Night', 'val': '5', 'aurl': '/assets/tp5-aicon.png', 'nurl': '/assets/tp5-icon.png' }
			],
			'valnames': {
				'pp': 'Vibrancy',
				'pd': 'Commutation',
				'rp': 'Diversity',
				'rd': 'Fluidity',
				'de': 'Density',
				'dd': 'Density Div',
				'tg': 'Total GDP',
				'ag': 'Ave GDP',
				'po': 'Population',
				'hp': 'House Price'
			},
			'models': [],
			'component': []
		}
	}

	getData() {
		return this.data;
	}
}

class dynamicView {
	/**
	 * [constructor description]
	 * @param  {[type]} id    [description]
	 * @param  {[type]} props 
	 *
	 * cda: city dynamic state
	 * tda: timeperiods dynamic state
	 * etype: 
	 * city:
	 * boundary:
	 * ftpval:
	 * scale:
	 * radius:
	 * opacity:
	 * useLocalExtrema:
	 * rev:
	 * 
	 * @return {[type]}       [description]
	 */
	constructor(id, props) {
		// 重置模板内代码,用于生成绑定 vue 实例
		document.getElementById(id).innerHTML = `<div class="cdacontainer" v-if="states.cda">
    <div v-for="(item, index) in regions" class="formap ui segment">
        <div class="onemap" :id="item.val+'cdamap'"></div>
        <div :id="item.val+'card'" class="dcard ui card">
            <div class="image">
                <h3 class="mapcardtitle ui header">{{ item.name }}</h3>
                <div class="dynamicmetric">
                    {{ valnames[ models[0].etype ] }}
                </div>
                <img :src="item.aurl">
            </div>
            <div class="content">
                <div class="description">
                    <vue-slider :id="'cdasli'+index" :ref="'cdasli'+index" v-bind="component[index]" @callback="updateSliderPoints(index)" @drag-end="updateSlider(index)" v-model="models[index].slider"></vue-slider>
                </div>
            </div>
        </div>
        <div :id="'cdadim' + index" class="ui dimmer">
            <div class="ui medium text loader">Loading Data</div>
        </div>
    </div>
</div>
<div class="tdacontainer" v-if="states.tda">
    <div v-for="(item, index) in tpfilters" class="sixmap ui segment">
        <div class="onemap" :id="item.val+'tdamap'"></div>
        <div :id="item.val+'card'" class="dcard ui card">
            <div class="image">
                <h3 class="mapcardtitle ui header">{{ item.name }}</h3>
                <div class="dynamicmetric">
                    {{ valnames[ models[0].etype ] }}
                </div>
                <img :src="item.aurl">
            </div>
            <div class="content">
                <vue-slider :id="'tdasli'+index" :ref="'tdasli'+index" v-bind="component[index]" @drag-end="updateSlider(index)" v-model="models[index].slider"></vue-slider>
            </div>
        </div>
        <div :id="'tdadim' + index" class="ui dimmer">
            <div class="ui medium text loader">Loading Data</div>
        </div>
    </div>
</div>
`;

		let data = new dydata();

		this.props = props;
		this.id = id;
		this.vue = null;
		this.data = data.getData();
		this.data.states.cda = props.cda;
		this.data.states.tda = props.tda;
		this.maps = props.cda ? new Array(4) : new Array(6);

		let num = 4;
		if (props.cda) {
			for (let i = 0; i < 4; i++) {
				this.data.models.push({
					'slider': [0, 100],
					'scale': { 'e': 1, 'd': 100 },
					'city': this.data.regions[i].val,
					'etype': props['etype'],
					'ftpval': '',
					'boundary': props['boundary']
				});
			}
		} else {
			num = 6;
			for (let i = 0; i < 6; i++) {
				this.data.models.push({
					'slider': [0, 100],
					'scale': { 'e': 1, 'd': 100 },
					'city': props['city'],
					'etype': props['etype'],
					'ftpval': i,
					'boundary': props['boundary']
				});
			}
		}

		for (let i = 0; i < num; i++) {
			this.data.component.push({
				tooltip: 'hover',
				value: [0, 100],
				clickable: false,
				interval: 0.5,
				formatter: function(value){
            		//console.log("value" + (value + 1))
            		return 	(100/Math.log(101) * Math.log(value + 1)).toFixed(2) + "%"
				},
				tooltipStyle: {
					"backgroundColor": "#000",
					"borderColor": "#000"
				},
				bgStyle: {
					'background': settings['whiteToRed']
				},
				processStyle: {
					'background': settings['whiteToRed']
				}
			})
		}

		this.initView();
	}

	initView() {
		let self = this,
			resp = null,
			cda = this.data.states.cda;
		this.vue = new Vue({
			el: `#${self.id}`,
			data: self.data,
			components: {
				vueSlider
			},
			methods: {
				'getOverview': function (index) {
					// 初始化子模块并添加遮罩层
				},
				'updateSliderPoints': function(index){
					//同步滑动条
					let i = Number.parseInt(index),
						cities = this.regions,
						tps = this.tpfilters,
						obj = this.models[i];
					
					if (cda) {
						// city
						for ( let j = 0; j < 4; j++)
							{
								if (['pp', 'pd', 'rp', 'rd', 'de'].indexOf(obj.etype) > -1) {
									if (j !== i){
										this.models[j]['slider'] = obj['slider'];
										}									
									}
								}
							}
					else {
						for ( let j = 0; j < 6; i++){
							if (j !== i){
								this.models[j]['slider'] = obj['slider'];
								}
						}
					}
				},
				/*
				'updateSlider': function (index) {
					// city dynamic analysis
					let i = Number.parseInt(index),
						cities = this.regions,
						tps = this.tpfilters,
						obj = this.models[i];

					this.component[i].bgStyle.background = `-webkit-repeating-linear-gradient(left, white 0%, white ${obj.slider[1] - 0.01}%, red ${obj.slider[1]}%, red 100%)`;

					if (cda) {
						// city
						if (['pp', 'pd', 'rp', 'rd', 'de'].indexOf(obj.etype) > -1) {
							// 获取 slider 情况下的配置值域以及用户其余选项
							let p = {
								'rev': self.props.rev,
								'etype': obj.etype,
							};

							let drawProps = getDrawProps(resp, obj['slider'], self.props, p);
							self.maps[i].mapcontourCDrawing({}, drawProps, true);
						} else {
							self.maps[i].boundaryDrawing({}, obj, true);
						}
					} else {
						let p = {
							'etype': obj.etype,
							'rev': self.props.rev
						}
						let drawProps = getDrawProps(resp, obj.slider, self.props, p);
						self.maps[i].mapcontourCDrawing({}, drawProps, true);
					}
				}*/
				
				'updateSlider': function (index) {
					// city dynamic analysis
					let i = Number.parseInt(index),
						cities = this.regions,
						tps = this.tpfilters,
						obj = this.models[i];

					this.component[i].bgStyle.background = `-webkit-repeating-linear-gradient(left, white 0%, white ${obj.slider[1] - 0.01}%, red ${obj.slider[1]}%, red 100%)`;

					if (cda) {
						// city
						for ( let i = 0; i < 4; i++)
							{
								if (['pp', 'pd', 'rp', 'rd', 'de'].indexOf(obj.etype) > -1) {
									
									// 获取 slider 情况下的配置值域以及用户其余选项
									let p = {
											'rev': self.props.rev,
											'etype': obj.etype,
									};
									
									if (['pp', 'pd', 'rp', 'rd', 'de'].indexOf(obj.etype) > -1) {
										if (i !== Number.parseInt(index)){
											this.component[i].bgStyle.background = `-webkit-repeating-linear-gradient(left, white 0%, white ${obj.slider[1] - 0.01}%, red ${obj.slider[1]}%, red 100%)`;
											this.models[i]['slider'] = obj['slider'];
											}
									}

								let drawProps = getDrawProps(resp, obj['slider'], self.props, p);
								self.maps[i].mapcontourCDrawing({}, drawProps, true);
							} else {
								self.maps[i].boundaryDrawing({}, obj, true);
							}
						}
					} else {
						//time
						for ( let i = 0; i < 6; i++){
							let p = {
									'etype': obj.etype,
									'rev': self.props.rev
								}
							if (i !== Number.parseInt(index)){
								this.component[i].bgStyle.background = `-webkit-repeating-linear-gradient(left, white 0%, white ${obj.slider[1] - 0.01}%, red ${obj.slider[1]}%, red 100%)`;
								this.models[i]['slider'] = obj['slider'];
								}
							let drawProps = getDrawProps(resp, obj.slider, self.props, p);
								self.maps[i].mapcontourCDrawing({}, drawProps, true);
						}
					}
				}			
			},
			mounted() {
				// city dynamic analysis
				let cities = this.regions,
					tps = this.tpfilters,
					models = this.models;
				
				if (cda) {
					// city
					for (let i = 0; i < 4; i++) {
						// 初始化子模块并添加遮罩层
						changeLoadState(`cdadim${i}`, true);
						self.maps[i] = new mapview(`${cities[i].val}cdamap`, `cgridleg${i}`, `cctrleg${i}`, cities[i].val);

						let obj = models[i];
						// 根据用户所选 metric 类型进行相应数据提取操作
						if (['pp', 'pd', 'rp', 'rd', 'de'].indexOf(obj.etype) > -1) {
								getCompareDatasets(obj).then(function(resu){
									//changeLoadState(`cdadim${i}`, true),
									resp = resu; 
									console.log("resp" + JSON.stringify(resu.features[100]))
									
							// 获取 entropy 和 density 资源
							getOverviewDatasets(obj).then(function (res) {
								changeLoadState(`cdadim${i}`, false);

								// 获取 slider 情况下的配置值域以及用户其余选项
								let p = {
									'rev': self.props.rev,
									'etype': obj.etype,
								}

								models[i].scale = res['prop']['scales'];
								//let drawProps = getDrawProps(res['prop']['scales'], obj['slider'], self.props, p);
									
								let drawProps = getDrawProps(resp, models[0]['slider'], self.props, p);
									self.maps[i].panTo(regionRecords[cities[i].val]['center']);
									self.maps[i].mapcontourCDrawing(res, drawProps);
																		
								}).catch(function (err) {
									console.error("Failed!", err);
								});
							}).catch(function (err) {
									console.error("Failed!", err);
							});
					
						} else {
							getBoundaryDatasets(obj.city).then(function (res) {
								changeLoadState(`cdadim${i}`, false);
								self.maps[i].boundaryDrawing(res, obj);
							}).catch(function (err) {
								console.error("Failed!", err);
							});
						}
					}

				} else {
					// time periods
					let etype = models[0].etype;
					if (['pp', 'pd', 'rp', 'rd', 'de'].indexOf(etype) > -1) {
						for (let i = 0; i < 6; i++) {
							let obj = models[i];
							changeLoadState(`tdadim${i}`, true);
							self.maps[i] = new mapview(`${tps[i].val}tdamap`, `tgridleg${i}`, `tctrleg${i}`, obj.city);
							
							getCompareDatasets(obj).then(function(resu){
								resp = resu; 
								console.log("resp" + JSON.stringify(resu.features[100]))

								// 获取 entropy 和 density 资源
								getOverviewDatasets(obj).then(function (res) {
									changeLoadState(`tdadim${i}`, false);

									let p = {
											'rev': self.props.rev,
											'etype': obj.etype
									}

									// 获取 slider 情况下的配置值域以及用户其余选项
									//models[i].scale = res['prop']['scales'];
									//let drawProps = getDrawProps(res['prop']['scales'], obj.slider, self.props, p);
								console.log("laaaaaaaa")
								let drawProps = getDrawProps(resp, obj.slider, self.props, p);
								self.maps[i].mapcontourCDrawing(res, drawProps);
							}).catch(function (err) {
								console.error("Failed!", err);
							});
							}).catch(function (err) {
								console.error("Failed!", err);
							});
					}

						//for (let i = 1; i < 6; i++) {
						//	self.maps[0].syncmap(self.maps[i].getMap());
						//}

					} else {
						alert('Not able to deal with Stats Data in different time periods.');
					}
				}
			}
		})
	}
/*					
					for (let i = 0; i < 4; i++) {
						// 初始化子模块并添加遮罩层
						changeLoadState(`cdadim${i}`, true);
						self.maps[i] = new mapview(`${cities[i].val}cdamap`, `cgridleg${i}`, `cctrleg${i}`, cities[i].val);

						let obj = models[i];
						// 根据用户所选 metric 类型进行相应数据提取操作
						if (['pp', 'pd', 'rp', 'rd', 'de'].indexOf(obj.etype) > -1) {
									
							// 获取 entropy 和 density 资源
							getOverviewDatasets(obj).then(function (res) {
								changeLoadState(`cdadim${i}`, false);

								// 获取 slider 情况下的配置值域以及用户其余选项
								let p = {
									'rev': self.props.rev,
									'etype': obj.etype,
								};
									
								console.log("resp1: " + resp)

								models[i].scale = res['prop']['scales'];
								//let drawProps = getDrawProps(res['prop']['scales'], obj['slider'], self.props, p);
									
								let drawProps = getDrawProps(resp, models[0]['slider'], self.props, p);
									self.maps[i].panTo(regionRecords[cities[i].val]['center']);
									self.maps[i].mapcontourCDrawing(res, drawProps);																		
								}).catch(function (err) {
									console.error("Failed!", err);
								});
										} else {
							getBoundaryDatasets(obj.city).then(function (res) {
								changeLoadState(`cdadim${i}`, false);
								self.maps[i].boundaryDrawing(res, obj);
							}).catch(function (err) {
								console.error("Failed!", err);
							});
						}
					}

				} else {
					// time periods
					let etype = models[0].etype;
					if (['pp', 'pd', 'rp', 'rd', 'de'].indexOf(etype) > -1) {
						for (let i = 0; i < 6; i++) {
							let obj = models[i];

							changeLoadState(`tdadim${i}`, true);
							self.maps[i] = new mapview(`${tps[i].val}tdamap`, `tgridleg${i}`, `tctrleg${i}`, obj.city);

							// 获取 entropy 和 density 资源
							getOverviewDatasets(obj).then(function (res) {
								changeLoadState(`tdadim${i}`, false);

								let p = {
									'rev': self.props.rev,
									'etype': obj.etype
								}

								// 获取 slider 情况下的配置值域以及用户其余选项
								models[i].scale = res['prop']['scales'];
								let drawProps = getDrawProps(res['prop']['scales'], obj.slider, self.props, p);
								self.maps[i].mapcontourCDrawing(res, drawProps);
							}).catch(function (err) {
								console.error("Failed!", err);
							});
						}

						for (let i = 1; i < 6; i++) {
							self.maps[0].syncmap(self.maps[i].getMap());
						}

					} else {
						alert('Not able to deal with Stats Data in different time periods.');
					}
				}
			}
		})
	}	
*/
	

	destroy() {
		this.vue.$destroy();
		delete this.maps;
		delete this.data;
	}
}

export default dynamicView
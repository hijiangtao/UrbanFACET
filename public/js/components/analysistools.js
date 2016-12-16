/**
 * analysistools.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2016-12-16 20:03:07
 * @version $Id$
 */

import $ from 'jquery'
import * as d3 from 'd3'
import * as echarts from 'echarts'
import {ArrayContains} from './lib'

let configData = {
	'timeperiods': ['workdayM', 'workdayF', 'workdayN', 'workdayA', 'workdayE', 'workdayI', 'holidayM', 'holidayF', 'holidayN', 'holidayA', 'holidayE', 'holidayI'],
	'pois': (function() {
		let arrs = []
		for (let i = 0; i < 11; i++) {
			arrs.push(`POI-${i+1}`)
		}
		return arrs
	})()
}

class analysistools {
	constructor() {
		let bottom = this
		this.data = {}
		this.dividlist = {
			'scatterid': 'scatterplot',
			'matrixid': 'matrixplot',
			'pieid': 'pieplot',
			'barid': 'barplot',
			'recid': 'recnumplot'
		}
		this.num = 0
	}

	/**
	 * [drawMatrix description]
	 * @param  {[type]} data [description]
	 * @param  {[type]} id   [description]
	 * @return {[type]}      [description]
	 */
	drawMatrix(data, id) {
		let myChart = echarts.init(document.getElementById(id));

		let maxVal = 0, series = []
		for (var i = 0; i < data.length; i++) {
			// series.push([])
			for (var j = 0; j < data[i].length; j++) {
				series.push([ i, j, data[i][j]])
				if (data[i][j] > maxVal) {
					maxVal = data[i][j]
				}
			}
		}

		series = series.map(function (item) {
			return [item[1], item[0], item[2].toFixed(2) || '-'];
		});

		let option = {
			title: {
				text: 'Location Distribution Possibility Matrix'
			},
			tooltip: {
				position: 'top'
			},
			animation: false,
			grid: {
				height: '72%',
				y: '10%',
				right: '2%'
			},
			xAxis: {
				type: 'category',
				data: configData['pois'],
				splitArea: {
					show: true
				}
			},
			yAxis: {
				type: 'category',
				data: configData['timeperiods'],
				splitArea: {
					show: true
				}
			},
			visualMap: {
				min: 0,
				max: maxVal,
				calculable: true,
				orient: 'horizontal',
				left: 'center',
				bottom: '3%'
			},
			series: [{
				name: 'Feature Matrix',
				type: 'heatmap',
				data: series,
				label: {
					normal: {
						show: true
					}
				},
				itemStyle: {
					emphasis: {
						shadowBlur: 10,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}]
		}

		myChart.setOption( option );
	}

	/**
	 * [drawRecNum description]
	 * @param  {[type]} data [description]
	 * @param  {[type]} id   [description]
	 * @return {[type]}      [description]
	 */
	drawRecNum(data, id) {
		let myChart = echarts.init(document.getElementById(id));

		let option = {
			title: {
				text: 'Records Number'
			},
			grid: {
				show: true,
				left: "13%",
				right: "3%"
			},
			legend: {
				data: ['Records Number'],
				align: 'left',
				show: false
			},
			toolbox: {
				// y: 'bottom',
				feature: {
					magicType: {
						type: ['bar', 'stack', 'tiled', 'line']
					},
					dataView: {},
					saveAsImage: {
						pixelRatio: 2
					}
				}
			},
			tooltip: {},
			xAxis: {
				data: configData['timeperiods'],
				silent: false,
				splitLine: {
					show: false
				}
			},
			yAxis: {},
			series: {
				name: 'Records Number',
				type: 'bar',
				data: data,
				animationDelay: function (idx) {
					return idx * 10;
				}
			},
			animationEasing: 'elasticOut',
			animationDelayUpdate: function (idx) {
				return idx * 5;
			}
		};

		myChart.setOption(option);
	}

	drawOcpStats(data, id, type, tpsel) {
		let arrlist = []; // POI 列
		if (type == 'res') {
			arrlist = [6]
		} else if (type == 'ent') {
			arrlist = [0,1]
		} else if (type == 'com') {
			arrlist = [7]
		} else if (type == 'edu') {
			arrlist = [2]
		}

		let pieorigindata = []
		for (let i = 0; i < 11; i++) {
			let tmp = 0;
			for( let j=0; j< 12; j++) {
				tmp += data[j][i];
			}
			pieorigindata.push({
				value: tmp, 
				name: configData['pois'][i]
			})
		}
		let pieselecteddata = [{
			value: 0,
			name: "The TP"
		}, {
			value: 0,
			name: "Other TP"
		}]
		for (let i = 0; i < arrlist.length; i++) {
			for(let j=0;j<12;j++) {
				if ( ArrayContains(tpsel, parseInt(j%6) )) {
					pieselecteddata[0]['value'] += data[j][i] 
				} else {
					pieselecteddata[1]['value'] += data[j][i]
				}
			}	
		}

		let piedata = [{
			value: 0,
			name: "The POI"
		}, {
			value: 0,
			name: "Other POI"
		}]

		for (let i = 0; i < data.length; i++) {
			for(let j=0; j< data[i].length;j++) {
				if (ArrayContains(arrlist, j )) {
					piedata[0]['value'] += data[j][i] 
				} else {
					piedata[1]['value'] += data[j][i]
				}
			}
		}

		let myChart = echarts.init(document.getElementById(id))

		let option = {
			title : {
				text: 'Selected POI distribution ',
				x:'center'
			},
			tooltip : {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
				x : 'center',
				y : 'bottom',
				data: ['The TP', 'Other TP', 'The POI', 'Other POI']
			},
			toolbox: {
				show : true,
				feature : {
					mark : {show: true},
					dataView : {show: true, readOnly: false},
					magicType : {
						show: true,
						type: ['pie', 'funnel']
					},
					restore : {show: true},
					saveAsImage : {show: true}
				}
			},
			calculable : true,
			series : [
				{
					name:'Selected',
					type:'pie',
					radius : [50, 70],
					center : ['20%', '50%'],
					avoidLabelOverlap: false,
					label: {
						normal: {
							show: false,
							position: 'center'
						},
						emphasis: {
							show: true,
							textStyle: {
								fontSize: '24',
								fontWeight: 'bold'
							}
						}
					},
					labelLine: {
						normal: {
							show: false
						}
					},
					data: pieselecteddata
				},
				{
					name:'POIs',
					type:'pie',
					radius : [50, 70],
					center : ['70%', '50%'],
					avoidLabelOverlap: false,
					data: piedata,
					labelLine: {
						normal: {
							show: false
						}
					},
					label: {
						normal: {
							show: false,
							position: 'center'
						},
						emphasis: {
							show: true,
							textStyle: {
								fontSize: '24',
								fontWeight: 'bold'
							}
						}
					},
				}
			]
		};

		myChart.setOption(option)
	}

	drawPOIStats(data, id) {
		let bardata = []

		for (let i = 0; i < data.length; i++) {
			bardata.push({
				name: configData['timeperiods'][i],
				type: 'bar',
				data: data[i],
				animationDelay: function (idx) {
					return idx * 10;
				}
			})
		}

		let myChart = echarts.init(document.getElementById(id))
		let option = {
			title: {
				text: 'POI possibility distribution'
			},
			legend: {
				data: configData['timeperiods'],
				align: 'left',
				bottom: '5px'
			},
			grid: {
				show: true,
				left: "5%",
				right: '2%'
			},
			toolbox: {
				// y: 'bottom',
				feature: {
					magicType: {
						type: ['stack', 'tiled', 'line', 'bar']
					},
					dataView: {},
					saveAsImage: {
						pixelRatio: 2
					}
				}
			},
			tooltip: {},
			xAxis: {
				data: configData['pois'],
				silent: false,
				splitLine: {
					show: false
				}
			},
			yAxis: {
			},
			series: bardata,
			animationEasing: 'elasticOut',
			animationDelayUpdate: function (idx) {
				return idx * 5;
			}
		};
		myChart.setOption(option);
	}

	drawScatter(data, id, legend) {
		let self = this
		let myChart = echarts.init(document.getElementById(id));

		let option = {
			title: {
				text: 'Cluster Results',
				top: 'top',
				left: 'center'
			},
			grid: {
				left: '28%',
				right: '1%',
				// top: '8%',
				bottom: '4%'
			},
			tooltip : {
				trigger: 'axis',
				showDelay : 0,
				axisPointer:{
					show: true,
					type : 'cross',
					lineStyle: {
						type : 'dashed',
						width : .5
					}
				},
				formatter: '类别 {a0}<br/>{c0}(x, y, 定位次数)',
				zlevel: 1
			},
			legend: {
				data: legend,
				orient: 'vertical',
				left: 'left',
				top: '1%',
				bottom: '0%',
				selected: {
					"-1": false
				}

			},
			toolbox: {
				show : true,
				feature : {
					mark : {show: true},
					dataZoom : {show: true},
					dataView : {show: true, readOnly: false},
					restore : {show: true},
					saveAsImage : {show: true}
				}
			},
			xAxis : [
				{
					type : 'value',
					scale:true
				}
			],
			yAxis : [
				{
					type : 'value',
					scale:true
				}
			],
			series : data
		};

		myChart.setOption(option);
	}

	/**
	 * [loadData description]
	 * @return {[type]} [description]
	 */
	loadData(file) {
		let self = this

		d3.request(file)
			.mimeType("text/csv")
			.response(function(xhr) { return d3.csvParse(xhr.responseText, rowParse); })
			.get(csvCallback);

		function rowParse(d) {
		  return {
		    id: d.id,
			x: +d.x,
			y: +d.y,
			records: +d.records,
			num: +d.num,
			class: d.class.toString()
		  };
		}

		function csvCallback(data) {
			let tmpdata = {}
			let clanum = 0

			for (let i = 0; i < data.length; i++) {
				let cla = data[i]['class']
				if (cla in tmpdata) {
					tmpdata[cla].push({
						'id': data[i]['id'],
						'x': data[i]['x'],
						'y': data[i]['y'],
						'records': data[i]['records'],
						'num': data[i]['num']
					})
				} else {
					clanum += 1
					tmpdata[cla] = [{
						'id': data[i]['id'],
						'x': data[i]['x'],
						'y': data[i]['y'],
						'records': data[i]['records'],
						'num': data[i]['num']
					}]
				}
			}

			let elegend = []
			for (let i = 0; i < clanum; i++) {
				elegend.push((i-1).toString())
			}
			self.num = clanum
			self.data = tmpdata

			let edata = []
			for (let prop in self.data) {
				let tmparrlist = {
					name: prop,
					type:'scatter',
					large: true,
					symbolSize: 2,
					data: []
				}
				for (let i = 0; i < self.data[prop].length; i++) {
					tmparrlist['data'].push([self.data[prop][i]['x'], self.data[prop][i]['y'], self.data[prop][i]['records']])
				}
				edata.push(tmparrlist)
			}

			self.drawScatter(edata, self.dividlist['scatterid'], elegend);
		};		
	}
}

export default analysistools
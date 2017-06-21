/**
 * data.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2016-12-20 17:10:34
 * @version $Id$
 */

'use strict'

/**
 * 存储行政区划与行政编号之间的匹配关系
 * @param {*} key 
 * @param {*} type 
 */
let getValue = function(key, type) {
	let districts = {
			"东城区": 1,"西城区":2,"朝阳区":3,"丰台区":4,"石景山区":5,"海淀区":6,"门头沟区":7,"房山区":8,"通州区":9,"顺义区":10,"昌平区":11,"大兴区":12,"怀柔区":13,"平谷区":14,"密云区":15,"延庆区":16,

			"和平区":17,"河东区":18,"河西区":19,"南开区":20,"河北区":21,"红桥区":22,"东丽区":23,"西青区":24,"津南区":25,"北辰区":26,"武清区":27,"宝坻区":28,"滨海新区":29,"宁河区":30,"静海区":31,"蓟县":32,

			"桥东区":33,"桥西区":34,"宣化区":35,"下花园区":36,"万全区":37,"崇礼区":38,"张北县":39,"康保县":40,"沽源县":41,"尚义县":42,"蔚县":43,"阳原县":44,"怀安县":45,"怀来县":46,"涿鹿县":47,"赤城县":48,

			"路南区":49,"路北区":50,"古冶区":51,"开平区":52,"丰南区":53,"丰润区":54,"曹妃甸区":55,"滦县":56,"滦南县":57,"乐亭县":58,"迁西县":59,"玉田县":60
		},
		districtArray = ["东城区","西城区","朝阳区","丰台区","石景山区","海淀区","门头沟区","房山区","通州区","顺义区","昌平区","大兴区","怀柔区","平谷区","密云区","延庆区","和平区","河东区","河西区","南开区","河北区","红桥区","东丽区","西青区","津南区","北辰区","武清区","宝坻区","滨海新区","宁河区","静海区","蓟县","桥东区","桥西区","宣化区","下花园区","万全区","崇礼区","张北县","康保县","沽源县","尚义县","蔚县","阳原县","怀安县","怀来县","涿鹿县","赤城县","路南区","路北区","古冶区","开平区","丰南区","丰润区","曹妃甸区","滦县","滦南县","乐亭县","迁西县","玉田县"]

	return '';
}

let regionRecords = function(city) {
    let citylocslist = {
		'bj': {
			'north': 41.055,
			'south': 39.445,
			'west': 115.422,
			'east': 117.515
		},
		'tj': {
			'north': 40.254,
			'south': 38.537,
			'west': 116.691,
			'east': 118.087
		},
		'zjk': {
			'north': 42.139,
			'south': 39.546,
			'west': 113.807,
			'east': 116.400
		},
		'ts': {
			'north': 40.457,
			'south': 38.908,
			'west': 117.488,
			'east': 119.306
		}
	}

	return citylocslist[city]
}

let getEntropyType = function(type) {
	let strlist = {
		'poi': 'p',
		'admin': 'a',
		'timeperiod': 't'
	}

	return strlist[type]
}

let getCityFullName = function(city) {
	let arr = {
		'bj': 'beijing',
		'tj': 'tianjin',
		'zjk': 'zhangjiakou',
		'ts': 'tangshan'
	}

	return arr[city];
}

module.exports = {
	getValue: getValue,
	getRegionBound: regionRecords,
	getEntropyType: getEntropyType,
	getCityFullName: getCityFullName
}
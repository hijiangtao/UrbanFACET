/**
 * initdata.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2016-12-23 19:41:03
 * @version $Id$
 */

import { genNumArr } from './lib'

let comp = {
    'params': {
        'regions': [
            { 'name': 'Beijing', 'val': 'bj', 'aurl': '/assets/bj-aticon.png', 'nurl': '/assets/bj-ticon.png', 'active': false },
            { 'name': 'Tianjin', 'val': 'tj', 'aurl': '/assets/tj-aticon.png', 'nurl': '/assets/tj-ticon.png', 'active': true },
            { 'name': 'Zhangjiakou', 'val': 'zjk', 'aurl': '/assets/zjk-aticon.png', 'nurl': '/assets/zjk-ticon.png', 'active': false },
            { 'name': 'Tangshan', 'val': 'ts', 'aurl': '/assets/ts-aticon.png', 'nurl': '/assets/ts-ticon.png', 'active': false }
        ],
        'etypes': [
            { 'name': 'POI', 'val': 'p' },
            { 'name': 'Districts', 'val': 'a' },
            { 'name': 'TimeBlocks', 'val': 't' }
        ],
        'ctypes': [
            { 'name': 'People Entropy', 'val': 'p' },
            { 'name': 'Record Entropy', 'val': 'r' }
        ],
        'mtypes': [
            { 'name': 'Summation', 'val': 'sum' },
            { 'name': 'Average', 'val': 'ave' }
        ],
        'dtypes': [
            { 'name': 'Basic', 'val': 'basic' },
            { 'name': 'DensityBased', 'val': 'density' }
            // { 'name': 'HSV', 'val': 'hsv' }
        ],
        'scales': {
            'entropy': 1,
            'density': 100
        },
        'tpfilters': [
            { 'name': 'Morning', 'val': '0', 'aurl': '/assets/tp0-aicon.png', 'nurl': '/assets/tp0-icon.png', 'active': true },
            { 'name': 'Forenoon', 'val': '1', 'aurl': '/assets/tp1-aicon.png', 'nurl': '/assets/tp1-icon.png', 'active': false },
            { 'name': 'Noon', 'val': '2', 'aurl': '/assets/tp2-aicon.png', 'nurl': '/assets/tp2-icon.png', 'active': false },
            { 'name': 'Afternoon', 'val': '3', 'aurl': '/assets/tp3-aicon.png', 'nurl': '/assets/tp3-icon.png', 'active': false },
            { 'name': 'Evening', 'val': '4', 'aurl': '/assets/tp4-aicon.png', 'nurl': '/assets/tp4-icon.png', 'active': false },
            { 'name': 'Night', 'val': '5', 'aurl': '/assets/tp5-aicon.png', 'nurl': '/assets/tp5-icon.png', 'active': false },
            { 'name': 'Weehour', 'val': '6', 'aurl': '/assets/tp6-aicon.png', 'nurl': '/assets/tp6-icon.png', 'active': false },
            { 'name': 'Weekend', 'val': '7', 'aurl': '/assets/tp7-aicon.png', 'nurl': '/assets/tp7-icon.png', 'active': false },
            { 'name': 'Workday', 'val': '8', 'aurl': '/assets/tp8-aicon.png', 'nurl': '/assets/tp8-icon.png', 'active': false }
        ]
    },
    'selections': {
        'city': 'tj',
        'etype': 'p',
        'ctype': 'p',
        'mtype': 'sum',
        'dtype': 'basic',
        'visval': 'entropy',
        'eVal': {
            'min': 0,
            'max': 1,
            'val': [0, 1]
        },
        'initialstate': true,
        'displaytype': '', // 存储 entropy 或者 density, 用于存储当前绘制图形的含义
        'contourmap': false,
        'multiColorSchema': true,
        'useLocalExtrema': false,
        'splitgridmap': false,
        'tpfilter': false,
        'ftpval': '0'
    },
    'components': {
        'eSlider': {
            tooltip: 'hover',
            value: [0, 100],
            // formatter: '{value*100}%',
            tooltipStyle: {
              "backgroundColor": "#000",
              "borderColor": "#f00"
            },
            bgStyle: {
              'background': '-webkit-gradient(linear, 0 0, 100% 0, from(white), to(red))'
            },
            processStyle: {
              'background': '-webkit-gradient(linear, 0 0, 100% 0, from(white), to(red))'
            }
        },
        'dSlider': {
            tooltip: 'hover',
            value: [0, 100],
            // formatter: '{value*100}%',
            tooltipStyle: {
              "backgroundColor": "#000",
              "borderColor": "#f00"
            },
            bgStyle: {
              'background': '-webkit-gradient(linear, 0 0, 100% 0, from(white), to(red))'
            },
            processStyle: {
              'background': '-webkit-gradient(linear, 0 0, 100% 0, from(white), to(red))'
            }
        }
    }
};

let indexvuedata = {
    'settings': {
        'entropytypes': [
            { 'name': 'temporal', 'val': 'row' },
            { 'name': 'spatio', 'val': 'col' },
        ],
        'regions': [
            { 'name': 'Beijing', 'val': 'BJ' },
            { 'name': 'Tianjin', 'val': 'TJ' },
            { 'name': 'Zhangjiakou', 'val': 'ZJK' },
            { 'name': 'Tangshan', 'val': 'TS' }
        ],
        'features': [
            { 'name': 'Workday', 'value': 1 },
            { 'name': 'Weekend', 'value': 2 },
            { 'name': 'Daytime', 'value': 3 }, 
            { 'name': 'Evening', 'value': 4 },
            { 'name': 'Workday Daytime', 'value': 5 },
            { 'name': 'Weekend Evening', 'value': 6 }
        ],
        'decomps': [
            { 'name': 't-SNE', 'value': 1 },
            { 'name': 'PCA', 'value': 2 },
            { 'name': 'MDS', 'value': 3 }, 
        ],
        'dbscan': {
            'minpts': genNumArr(20, 5, 7)
        },
        'themes': [
            { 'name': 'Education', 'value': 'edu' },
            { 'name': 'Employee', 'value': 'empl' },
            { 'name': 'Tourists', 'value': 'tour' },
            { 'name': 'Healthcare', 'value': 'heal' },
            { 'name': 'Students', 'value': 'stu' },
            { 'name': 'Finicial', 'value': 'fini' }
        ],
        // 对应themes的 value，表示每类人群的可选参数值
        'tmodels': {
            'edu': [ 
                { 'field': 'Daytime Occupation', 'min': 0, 'max': 100, 'pred': 40 },
                { 'field': 'Evening Occupation', 'min': 0, 'max': 100, 'pred': 40 },
                { 'field': 'Weekday Occupation', 'min': 0, 'max': 100, 'pred': 40 },
                { 'field': 'Class time Occupation', 'min': 0, 'max': 100, 'pred': 40 }
            ],
            'empl': [],
            'tour': [],
            'heal': [],
            'stu': [],
            'fini': []
        },
        // 对应统计指标
        'modelparams': [
            { 'name': 'morning', 'val': 1 },
            { 'name': 'forenoon', 'val': 2 },
            { 'name': 'noon', 'val': 3 },
            { 'name': 'afternoon', 'val': 4 },
            { 'name': 'evening', 'val': 5 },
            { 'name': 'night', 'val': 6 },
            { 'name': 'workday', 'val': 7 },
            { 'name': 'weekend', 'val': 8 },
            { 'name': 'daytime', 'val': 9 },
            { 'name': 'workday daytime', 'val': 10 },
            { 'name': 'weekend daytime', 'val': 11 },
            { 'name': 'workday evening', 'val': 12 },
            { 'name': 'weekend evening', 'val': 13 }
        ],
        'timeperiods': [
            { 'name': 'morning', 'val': 1 },
            { 'name': 'forenoon', 'val': 2 },
            { 'name': 'noon', 'val': 3 },
            { 'name': 'afternoon', 'val': 4 },
            { 'name': 'evening', 'val': 5 },
            { 'name': 'night', 'val': 6 }
        ],
        'poitypes': [
            { 'name': 'Food', 'val': 1 },
            { 'name': 'Clothes', 'val': 2 },
            { 'name': 'Residence', 'val': 3 },
            { 'name': 'Transport', 'val': 4 },
            { 'name': 'Finance', 'val': 5 },
            { 'name': 'Education', 'val': 6 },
            { 'name': 'Other', 'val': 7 }
        ],
        'daytypes': [
            { 'name': 'Workday', 'val': 'workday', 'timeperiods': [
                { 'name': 'morning', 'val': 1 },
                { 'name': 'forenoon', 'val': 2 },
                { 'name': 'noon', 'val': 3 },
                { 'name': 'afternoon', 'val': 4 },
                { 'name': 'evening', 'val': 5 },
                { 'name': 'night', 'val': 6 }
            ] },
            { 'name': 'Weekend', 'val': 'holiday', 'timeperiods': [
                { 'name': 'morning', 'val': 1 },
                { 'name': 'forenoon', 'val': 2 },
                { 'name': 'noon', 'val': 3 },
                { 'name': 'afternoon', 'val': 4 },
                { 'name': 'evening', 'val': 5 },
                { 'name': 'night', 'val': 6 }
            ] },
            { 'name': 'ALL', 'val': 'all', 'timeperiods': [
                { 'name': 'workday', 'val': 7 },
                { 'name': 'weekend', 'val': 8 },
                { 'name': 'all', 'val': 9 },
            ] }
        ],
        'madaytypes': [
            { 'name': 'Workday', 'val': 'workday' },
            { 'name': 'Weekend', 'val': 'holiday' }
        ],
        'sortorders': [
            { 'name': 'ASC', 'val': 1 },
            { 'name': 'DEC', 'val': -1 }
        ],
        // vc class dropdown menu
        'classes': [],
        // 
        'qmodes': [
        	{ 'name': 'Add Class', 'val': 1, 'tooltip': 'visual comparison on two different classes' },
        	{ 'name': 'Add TimePeriod', 'val': 2, 'tooltip': 'visual comparison on class with two different time periods' },
        ],
        'entropyfilterrange': Math.log(12),
        'hotareas': [
            { 'name': '回龙观', 'val': 'hlg' },
            { 'name': '天通苑', 'val': 'tty' },
            { 'name': '北航', 'val': 'bh' },
            { 'name': '西直门', 'val': 'xzm' },
            { 'name': '北京西站', 'val': 'bjxz' }
        ]
    },
    'selections': {
        'entropymodeName': 'spatio',
        'entropymodeVal': 'col',
        'regionName': 'BJ',
        'regionVal': 'Beijing',
        'featureName': 'Workday',
        'featureVal': 1,
        'decompName': 'Decompose Method',
        'themeName': 'Education',
        'themeVal': 'edu',
        'tmodelVal': [ 
            { 'field': 'Daytime Occupation', 'min': 0, 'max': 100, 'pred': 40 },
            { 'field': 'Evening Occupation', 'min': 0, 'max': 100, 'pred': 40 },
            { 'field': 'Weekday Occupation', 'min': 0, 'max': 100, 'pred': 40 },
            { 'field': 'Class time Occupation', 'min': 0, 'max': 100, 'pred': 40 }
        ],
        'samplerateVal': '10',
        
        'dbscanminptsName': '40',
        'dbscaneps': '0.13',
        'modelParamName': 'morning',
        'modelParamVal': '1',
        'sortorderVal': '',
        'modelParamRangeVal': 10,
        
        'vctimeName': 'TimePeriod',
        'compvctimeName': 'ComparedTime',
        'vcdaytypeVal': '',
        'vctimeperiodVal': '',
        'compvcdaytypeVal': '',
        'compvctimeperiodVal': '',
        'vcclaName': 'Select Class',
        'compvcclaName': 'ComparedClass',
        'vcqmodeName': 'Comparison',
        'vcqmodeVal': 0,

        'matimeVal': 'Select time',
        'madaytypeVal': '',
        'matimeperiodVal': '',

        'entropyfilterVal': 0.3,
        'entropyfilterreverse': false,

        'areaName': 'Select Area',
        'areaVal': ''
    },
    'states': {
        'userid': '-1',
        'tsnetrain': false,
        'entropyfilter': false,
        'clustertrain': false,
        'labeltrain': false,
        'vcquery': false,
        'themesdisplay': false,
        'clusterdisplay': false,
        'anadisplay': false,
        'clusterscatterdisplay': false,
        'madisplayquery': false,
        'areaquery': false
    },
    'results': {
        'classlist': [],
        'clafilename': '',
        'decomposeimgurl': '',
        'userpoints': [],
        'mapresults': {
            'data': ['',''],
            'cla': ['',''],
            'tp': ['','']
        }
    }
};

let labvuedata = {
	begin: false,
	cluster: [{
		'name': '居住区信息统计',
		'val': 'res'
	}, {
		'name': '商业区信息统计',
		'val': 'com'
	}, {
		'name': '饮食休闲娱乐信息统计',
		'val': 'ent'
	}, {
		'name': '教育场所信息统计',
		'val': 'edu'
	}],
	clustersel: "res",
	results: [{
		"name": 'workday',
		"val": 1
	}, {
		"name": 'weekend',
		"val": 2
	}, {
		'name': 'daytime',
		'val': 3
	}, {
		'name': 'evening',
		'val': 4
	}, {
		'name': 'wodaytime',
		'val': 5
	}, {
		'name': 'weevening',
		'val': 6
	}],
	resultsel: 'daytime',
	idlist: "",
	curDataset: [],
	timeperiods: [{
		'name': 'morning ',
		'value': 0
	},{
		'name': 'forenoon ',
		'value': 1
	},{
		'name': 'noon',
		'value': 2
	},{
		'name': 'afternoon ',
		'value': 3
	},{
		'name': 'evening ',
		'value': 4
	},{
		'name': 'night ',
		'value': 5
	}],
	tpsel: []
};

let featureTypes = ['workday', 'weekend', 'daytime', 'evening', 'wodaytime', 'weevening'];

let regionsList = [{
    'name': '回龙观',
    'coordinates': []
}, {
    'name': '天通苑',
    'coordinates': []
}, {
    'name': ''
}];

let regionRecords = {
    'bj': {
        'center': [39.9120, 116.3907]
    },
    'tj': {
        'center': [39.1311, 117.1857]
    },
    'ts': {
        'center': [39.6512, 118.1648]
    },
    'zjk': {
        'center': [40.7915, 114.8875]
    }
};

let chartTestData = [{"group-id":"1","num":"142378"}, {"group-id":"2","num":"2173"}, {"group-id":"3","num":"1052"}, {"group-id":"4","num":"663"}, {"group-id":"5","num":"507"}, {"group-id":"6","num":"379"}, {"group-id":"7","num":"312"}, {"group-id":"8","num":"237"}, {"group-id":"9","num":"201"}, {"group-id":"10","num":"235"}, {"group-id":"11","num":"198"}, {"group-id":"12","num":"159"}, {"group-id":"13","num":"129"}, {"group-id":"14","num":"128"}, {"group-id":"15","num":"98"}, {"group-id":"16","num":"96"}, {"group-id":"17","num":"78"}, {"group-id":"18","num":"71"}, {"group-id":"19","num":"53"}, {"group-id":"20","num":"58"}, {"group-id":"21","num":"55"}, {"group-id":"22","num":"40"}, {"group-id":"23","num":"40"}, {"group-id":"24","num":"28"}, {"group-id":"25","num":"34"}, {"group-id":"26","num":"20"}, {"group-id":"27","num":"14"}, {"group-id":"28","num":"18"}, {"group-id":"29","num":"22"}, {"group-id":"30","num":"17"}, {"group-id":"31","num":"21"}, {"group-id":"32","num":"10"}, {"group-id":"33","num":"17"}, {"group-id":"34","num":"13"}, {"group-id":"35","num":"10"}, {"group-id":"36","num":"7"}, {"group-id":"37","num":"11"}, {"group-id":"38","num":"7"}, {"group-id":"39","num":"11"}, {"group-id":"40","num":"7"}, {"group-id":"41","num":"6"}, {"group-id":"42","num":"7"}, {"group-id":"43","num":"4"}, {"group-id":"44","num":"2"}, {"group-id":"45","num":"3"}, {"group-id":"46","num":"5"}, {"group-id":"47","num":"3"}, {"group-id":"48","num":"3"}, {"group-id":"49","num":"3"}, {"group-id":"50","num":"1"}, {"group-id":"51","num":"7"}, {"group-id":"52","num":"4"}, {"group-id":"53","num":"2"}, {"group-id":"54","num":"1"}, {"group-id":"55","num":"3"}, {"group-id":"58","num":"4"}, {"group-id":"59","num":"2"}, {"group-id":"60","num":"2"}, {"group-id":"61","num":"1"}, {"group-id":"62","num":"1"}, {"group-id":"63","num":"2"}, {"group-id":"64","num":"1"}, {"group-id":"65","num":"2"}, {"group-id":"66","num":"1"}, {"group-id":"67","num":"1"}, {"group-id":"69","num":"2"}, {"group-id":"70","num":"1"}, {"group-id":"74","num":"2"}, {"group-id":"75","num":"1"}, {"group-id":"80","num":"1"}, {"group-id":"81","num":"1"}, {"group-id":"83","num":"1"}, {"group-id":"86","num":"1"}, {"group-id":"90","num":"1"}, {"group-id":"101","num":"1"}];

export {
	indexvuedata,
	labvuedata,
    featureTypes,
    regionRecords,
    comp,
    chartTestData
}
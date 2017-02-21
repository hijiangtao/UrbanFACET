/**
 * initdata.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2016-12-23 19:41:03
 * @version $Id$
 */

import { genNumArr } from './lib'

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

let comp = {
    'params': {
        'regions': [
            { 'name': 'Beijing', 'val': 'bj' },
            { 'name': 'Tianjin', 'val': 'tj' },
            { 'name': 'Zhangjiakou', 'val': 'zjk' },
            { 'name': 'Tangshan', 'val': 'ts' }
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
        'scales': {
            'entropy': 1,
            'density': 100
        }
    },
    'selections': {
        'city': 'tj',
        'etype': 'p',
        'ctype': 'p',
        'mtype': 'sum',
        'eVal': {
            'min': 0,
            'max': 1,
            'val': [0, 1]
        }
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

export {
	indexvuedata,
	labvuedata,
    featureTypes,
    regionRecords,
    comp
}
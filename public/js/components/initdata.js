/**
 * initdata.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2016-12-23 19:41:03
 * @version $Id$
 */

import { genNumArr } from './lib'

let vuedata = {
    'settings': {
        'regions': [
            { 'name': 'Beijing' },
            { 'name': 'Tianjin' },
            { 'name': 'Zhangjiakou' },
            { 'name': 'Tangshan' }
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
            { 'name': 'Workday', 'val': 'wo' },
            { 'name': 'Weekend', 'val': 'we' }
        ],
        'sortorders': [
            { 'name': 'ASC', 'val': 1 },
            { 'name': 'DEC', 'val': -1 }
        ],
        // vc class dropdown menu
        'classes': []
    },
    'selections': {
        'regionVal': 'Select Region',
        'featureName': 'Select Feature',
        'featureVal': 0,
        'decompName': 'Decompose Method',
        'themeName': 'Select Theme',
        'themeVal': '',
        'tmodelVal': '',
        'vctimeName': 'Select query time',
        'vcdaytypeVal': '',
        'vctimeperiodVal': '',
        'dbscanminptsName': 'Select MinPts',
        'dbscaneps': '0',
        'modelParamName': 'Stats index',
        'modelParamVal': '',
        'sortorderVal': '',
        'modelParamRangeVal': 10,
        'vcclaName': 'Select Class',
        'vcclaVal': ''
    },
    'states': {
        'userid': Math.random()*10000,
        'tsnetrain': false,
        'clustertrain': false,
        'vcquery': false,
        'themesdisplay': false
    },
    'results': {
        'classlist': []
    }
}


export {
	vuedata
}
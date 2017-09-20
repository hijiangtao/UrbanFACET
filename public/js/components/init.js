/**
 * init.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-03-05 16:10:49
 * @version $Id$
 */

'use strict'

const settings = {
    // 'whiteToRed': '-webkit-gradient(linear, 0 0, 100% 0, from(white), to(red))'
    // 与实际设置不同,因为有遮挡所以微调过
    'whiteToRed': '-webkit-linear-gradient(left, #ffffff 0%,#0000ff 25%,#00ff00 45%,#ffff00 70%,#ff0000 100%)'
}

/**
 * 储存四个城市图标及属性信息
 * @type {Array}
 */
const regions = [{
        'name': 'Beijing',
        'val': 'bj',
        'aurl': '/assets/bj-aicon.png',
        'nurl': '/assets/bj-icon.png'
    },
    {
        'name': 'Tianjin',
        'val': 'tj',
        'aurl': '/assets/tj-aicon.png',
        'nurl': '/assets/tj-icon.png'
    },
    {
        'name': 'Zhangjiakou',
        'val': 'zjk',
        'aurl': '/assets/zjk-aicon.png',
        'nurl': '/assets/zjk-icon.png'
    },
    {
        'name': 'Tangshan',
        'val': 'ts',
        'aurl': '/assets/ts-aicon.png',
        'nurl': '/assets/ts-icon.png'
    }
]

let home = {
    'params': {
        /**
         * region object
         */
        'regions': regions,
        /**
         * entropy types
         */
        'etypes': [{
                'name': 'Vibrancy',
                'val': 'pp'
            },
            {
                'name': 'Commutation',
                'val': 'pd'
            },
            {
                'name': 'Diversity',
                'val': 'rp'
            },
            {
                'name': 'Fluidity',
                'val': 'rd'
            },
            {
                'name': 'Density',
                'val': 'de'
            },
            {
                'name': 'GDP',
                'val': 'ag'
            },
            {
                'name': 'Population',
                'val': 'po'
            },
            {
                'name': 'House Price',
                'val': 'hp'
            }
        ],
        'otypes': [{
                'name': 'Empty',
                'val': 'e'
            },
            {
                'name': 'POI',
                'val': 'p'
            },
            {
                'name': 'District',
                'val': 'd'
            },
            // { 'name': 'Density', 'val': 2 },
            {
                'name': 'FACET',
                'val': 'f'
            }
        ],
        /**
         * timeblock filters object
         */
        'tpfilters': [{
                'name': 'Allday',
                'val': '9',
                'aurl': '/assets/tp9-aicon.png',
                'nurl': '/assets/tp9-icon.png'
            },
            {
                'name': 'Morning',
                'val': '0',
                'aurl': '/assets/tp0-aicon.png',
                'nurl': '/assets/tp0-icon.png'
            },
            {
                'name': 'Forenoon',
                'val': '1',
                'aurl': '/assets/tp1-aicon.png',
                'nurl': '/assets/tp1-icon.png'
            },
            {
                'name': 'Noon',
                'val': '2',
                'aurl': '/assets/tp2-aicon.png',
                'nurl': '/assets/tp2-icon.png'
            },
            {
                'name': 'Afternoon',
                'val': '3',
                'aurl': '/assets/tp3-aicon.png',
                'nurl': '/assets/tp3-icon.png'
            },
            {
                'name': 'Evening',
                'val': '4',
                'aurl': '/assets/tp4-aicon.png',
                'nurl': '/assets/tp4-icon.png'
            },
            {
                'name': 'Night',
                'val': '5',
                'aurl': '/assets/tp5-aicon.png',
                'nurl': '/assets/tp5-icon.png'
            }
        ],
        'tpfilters2': [{
                'name': 'Allday',
                'val': '10',
                'aurl': '/assets/tp10-aicon.png',
                'nurl': '/assets/tp10-icon.png'
            },
            {
                'name': 'Weekday',
                'val': '7',
                'aurl': '/assets/tp7-aicon.png',
                'nurl': '/assets/tp7-icon.png'
            },
            {
                'name': 'Weekend',
                'val': '8',
                'aurl': '/assets/tp8-aicon.png',
                'nurl': '/assets/tp8-icon.png'
            }
        ],
        'pois': [{
                'name': 'All',
                'val': 0
            },
            {
                'name': 'Food&Supply',
                'val': 1
            },
            {
                'name': 'Entertainment&Leisure',
                'val': 2
            },
            {
                'name': 'Education',
                'val': 3
            },
            {
                'name': 'Transportation',
                'val': 4
            },
            {
                'name': 'Healthcare&Emergency',
                'val': 5
            },
            {
                'name': 'Financial&Bank',
                'val': 6
            },
            {
                'name': 'Accommodation',
                'val': 7
            },
            {
                'name': 'Office&Commercial',
                'val': 8
            },
            {
                'name': 'Natural Landscape',
                'val': 9
            },
            {
                'name': 'Factory&Manufacturer',
                'val': 10
            }
        ],
        'scales': [{
                'name': 'City',
                'val': 0
            },
            {
                'name': 'Division',
                'val': 1
            },
            {
                'name': 'Region',
                'val': 2
            },
            {
                'name': 'Street',
                'val': 3
            }
        ]
    },
    /**
     * objs: 面板对象,每个面板承载一个分析对象
     * city: 选中的城市
     * etype: 选中的 entropy 主题
     * dtype: 可视化展示的数据类型
     * ctrmap: 是否展示 contour map, 否则展示 gridmap
     * ctrsets: contour map 相关参数设置
     * maprev: 可视化结果值域映射是否翻转
     * ftpon: 是否开启 timeblocks 过滤功能
     * ftpval: 选中的 ftp value
     * 
     */
    'sels': {
        'objs': [{
            'city': 'bj',
            'etype': 'de',
            'ftpval': '9',
            'ftpval2': '10',
            'reverse': false,
            'scales': {
                'e': 1,
                'd': 100
            },
            'id': {
                'card': 'card0',
                'map': 'map0',
                'tab': 'tab0'
            },
            'slider': {
                // width: 140,
                tooltip: 'hover',
                value: [0, 100],
                clickable: false,
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
            },
            'data': {
                'smec': {
                    "ap": 0.5098208237393245,
                    "ar": 0.6848672333841485,
                    "pp": 1.3295073420089694,
                    "pr": 1.4111167395551567,
                    "c": [116.40605294, 39.91343848],
                    "d": 165159332,
                    "name": "Beijing"
                }
            }
        }],
        'otype': 'e', //overlay type
        'ptype': 0, //pois type
        'stype': 0, //scales type
        'areaselect': false, //是否选中区域
        'ctrsets': {
            'useLocalExtrema': false,
            'opacity': 0.5,
            'radius': 2
        },
        'lstnum': 1, // 页面在本次操作之前存在的标签个数(包括额外overlay图层)
        'lstindex': 0, // 存储上次操作的页面标签
        'dynamic': false
    },
    'components': {
        'eSlider': {
            tooltip: 'hover',
            value: [0, 100],
            clickable: false,
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
        },
        'hrSlider': {
            width: "auto",
            tooltip: 'hover',
            min: 1,
            max: 2.6,
            interval: 0.01,
            disabled: false,
            clickable: false,
            tooltipStyle: {
                "backgroundColor": "#000",
                "borderColor": "#000"
            }
        }
    },
    'cals': {
        'cities': {
            'bj': 'Beijing',
            'tj': 'Tianjin',
            'zjk': 'Zhangjiakou',
            'ts': 'Tangshan'
        },
        'enps': {
            'pp': 'Vibrancy',
            'pd': 'Commutation',
            'rp': 'Diversity',
            'rd': 'Fluidity',
            'de': 'Density',
            'tg': 'Total GDP',
            'ag': 'Ave GDP',
            'po': 'Population',
            'hp': 'House Price'
        },
        'ops': {
            'e': 'Empty',
            'p': 'POI',
            'd': 'District',
            'f': 'FACET'
        },
        'pois': ['All', 'Food&Supply', 'Entertainment&Leisure', 'Education', 'Transportation', 'Healthcare&Emergency', 'Financial&Bank', 'Accommodation', 'Office&Commercial', 'Natural Landscape', 'Factory&Manufacturer'],
        'scales': ['City', 'Division', 'Region', 'Street'],
        'cimgs': {
            'bj': {
                'aurl': '/assets/bj-aicon.png',
                'nurl': '/assets/bj-icon.png'
            },
            'tj': {
                'aurl': '/assets/tj-aicon.png',
                'nurl': '/assets/tj-icon.png'
            },
            'zjk': {
                'aurl': '/assets/zjk-aicon.png',
                'nurl': '/assets/zjk-icon.png'
            },
            'ts': {
                'aurl': '/assets/ts-aicon.png',
                'nurl': '/assets/ts-icon.png'
            }
        }
    }
};

const regionRecords = {
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

const stats = {
    /**
     * [TotalGDP, Population, Area, AveGDP, HousePrice]
     */
    'bj': {
        "东城区": [1857.8, 90.5, 42, 205282, 90807],
        "西城区": [3270.40, 129.80, 51, 251957, 107297],
        "丰台区": [1169.9, 232.4, 306, 50340, 50576],
        "海淀区": [4613.50, 369.4, 431, 124892, 75902],
        "石景山区": [430.2, 65.2, 84, 65982, 48387],
        "门头沟区": [144.5, 30.8, 1451, 46916, 34046],
        "顺义区": [1440.9, 102.0, 1020, 141265, 33008],
        "通州区": [594.5, 137.8, 906, 43142, 39507],
        "朝阳区": [4640.2, 395.5, 455, 117325, 62235],
        "大兴区": [1591.6, 156.2, 1026, 101895, 36091],
        "昌平区": [657.3, 196.3, 1344, 33484, 30583],
        "平谷区": [196.2, 42.3, 950, 46383, 17873],
        "怀柔区": [234.2, 38.4, 2123, 60990, 23268],
        "延庆区": [107.35, 31.4, 1994, 34188, 20894],
        "房山区": [554.7, 104.6, 1990, 53031, 21976],
        "密云区": [226.7, 47.9, 2229, 47328, 20437]
    },
    'tj': {
        "蓟州区": [409.00, 90.71, 1593.0, 45089.0, 8200],
        "和平区": [784.93, 37.81, 10.0, 207599.0, 30244],
        "河西区": [780.0, 101.52, 37.0, 76832.0, 19697],
        "南开区": [586.7, 16.91, 39.0, 50184.0, 19308],
        "河东区": [310.0, 98.85, 39.0, 31361.0, 16087],
        "河北区": [416.0, 90.84, 27.0, 45795.0, 15112],
        "西青区": [1010.40, 84.24, 545.0, 119943, 12205],
        "津南区": [808.3, 70.89, 401.0, 114022.0, 9153],
        "北辰区": [960.0, 80.85, 478.0, 118738.0, 11369],
        "武清区": [1090.0, 113.43, 1570.0, 96095.0, 7123],
        "宁河区": [551.17, 47.46, 1414.0, 116134.0, 8874],
        "静海区": [650.0, 76.67, 1476.0, 84779.0, 7210],
        "宝坻区": [630.0, 90.04, 1523.0, 69969.0, 6779],
        "东丽区": [905.56, 71.70, 460.0, 126298.0, 10095],
        "滨海新区": [9270.31, 297.01, 2270.0, 312121.0, 9693],
        "红桥区": [196.0, 58.76, 21.0, 33356.0, 15717]
    },
    'ts': {
        "古冶区": [],
        "路南区": [],
        "开平区": [],
        "路北区": [],
        "丰润区": [],
        "滦南县": [],
        "曹妃甸区": [],
        "迁西县": [],
        "滦县": [],
        "乐亭县": [],
        "玉田县": [],
        "迁安市": [],
        "遵化市": [],
        "丰南区": []
    },
    'zjk': {
        "崇礼县": [],
        "赤城县": [],
        "沽源县": [],
        "怀安县": [],
        "怀来县": [],
        "康保县": [],
        "桥东区": [],
        "桥西区": [],
        "尚义县": [],
        "万全县": [],
        "蔚县": [],
        "下花园区": [],
        "宣化区": [],
        "宣化县": [],
        "阳原县": [],
        "张北县": [],
        "涿鹿县": []
    }
};

/**
 * 存储各城市 metric 以及 density 的最大值
 * @type {Object}
 */
let smecMax = {
    'bj': {
        'm': 1.4111167395551567,
        'd': 836201452
    },
    'tj': {
        'm': 1.1312344388511115,
        'd': 489343792
    },
    'ts': {
        'm': 1.017137606550299,
        'd': 161914965
    },
    'zjk': {
        'm': 0.617922305906725,
        'd': 63151878
    }
}

let smecAve = {
    'bj': {
        "ap": 0.349552064745511,
        "ar": 0.349529453722475,
        "pp": 1.10768395047002,
        "pr": 1.13533312941438,
        "c": [116.3907, 39.9120],
        "d": 8407648917,
        "name": "Beijing",
        "disnum": 16
    },
    'tj': {
        "ap": 0.311879437094161,
        "ar": 0.311942440535186,
        "pp": 0.588935561107274,
        "pr": 0.563593511139423,
        "c": [117.1857, 39.1311],
        "d": 2858575880,
        "name": "Tianjin",
        "disnum": 16
    },
    'ts': {
        "ap": 0.142242470183699,
        "ar": 0.142227779896852,
        "pp": 0.655545897603267,
        "pr": 0.671277817559785,
        "c": [118.1648, 39.6512],
        "d": 920364499,
        "name": "Tangshan",
        "disnum": 14
    },
    'zjk': {
        "ap": 0.145383924656692,
        "ar": 0.14534363999775,
        "pp": 0.44685112708024,
        "pr": 0.372831640047352,
        "c": [114.8875, 40.7915],
        "d": 317252149,
        "name": "Zhangjiakou",
        "disnum": 17
    }
}

let getRealProp = function (prop) {
    let arr = {
        'pp': 'pp',
        'pd': 'ap',
        'rp': 'pr',
        'rd': 'ar',
        'de': 'd'
    }

    return arr[prop];
}

export {
    regionRecords,
    home,
    regions,
    stats,
    smecMax,
    smecAve,
    getRealProp
}
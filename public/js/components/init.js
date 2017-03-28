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

let home = {
    'params': {
        /**
         * region object
         */
        'regions': [
            { 'name': 'Beijing', 'val': 'bj', 'aurl': '/assets/bj-aicon.png', 'nurl': '/assets/bj-icon.png' },
            { 'name': 'Tianjin', 'val': 'tj', 'aurl': '/assets/tj-aicon.png', 'nurl': '/assets/tj-icon.png' },
            { 'name': 'Zhangjiakou', 'val': 'zjk', 'aurl': '/assets/zjk-aicon.png', 'nurl': '/assets/zjk-icon.png' },
            { 'name': 'Tangshan', 'val': 'ts', 'aurl': '/assets/ts-aicon.png', 'nurl': '/assets/ts-icon.png' }
        ],
        /**
         * entropy types
         */
        'etypes': [
            { 'name': 'Vibrancy', 'val': 'pp' },
            { 'name': 'Commutation', 'val': 'pd' },
            { 'name': 'Diversity', 'val': 'rp' },
            { 'name': 'Fluidity', 'val': 'rd' },
            { 'name': 'Density', 'val': 'de' },
            { 'name': 'GDP', 'val': 'ag' },
            { 'name': 'Population', 'val': 'po' },
            { 'name': 'House Price', 'val': 'hp' }
        ],
        'otypes': [
            { 'name': 'Empty', 'val': 'e' },
            { 'name': 'POI', 'val': 'p' },
            { 'name': 'District', 'val': 'd' },
            // { 'name': 'Density', 'val': 2 },
            { 'name': 'FACET', 'val': 'f' }
        ],
        /**
         * timeblock filters object
         */
        'tpfilters': [
            { 'name': 'Morning', 'val': '0', 'aurl': '/assets/tp0-aicon.png', 'nurl': '/assets/tp0-icon.png' },
            { 'name': 'Forenoon', 'val': '1', 'aurl': '/assets/tp1-aicon.png', 'nurl': '/assets/tp1-icon.png' },
            { 'name': 'Noon', 'val': '2', 'aurl': '/assets/tp2-aicon.png', 'nurl': '/assets/tp2-icon.png' },
            { 'name': 'Afternoon', 'val': '3', 'aurl': '/assets/tp3-aicon.png', 'nurl': '/assets/tp3-icon.png' },
            { 'name': 'Evening', 'val': '4', 'aurl': '/assets/tp4-aicon.png', 'nurl': '/assets/tp4-icon.png' },
            { 'name': 'Night', 'val': '5', 'aurl': '/assets/tp5-aicon.png', 'nurl': '/assets/tp5-icon.png' },
            { 'name': 'Allday', 'val': '9', 'aurl': '/assets/tp9-aicon.png', 'nurl': '/assets/tp9-icon.png' }
        ],
        'tpfilters2': [
            { 'name': 'Weekday', 'val': '7', 'aurl': '/assets/tp7-aicon.png', 'nurl': '/assets/tp7-icon.png' },
            { 'name': 'Weekend', 'val': '8', 'aurl': '/assets/tp8-aicon.png', 'nurl': '/assets/tp8-icon.png' },
            { 'name': 'Allday', 'val': '10', 'aurl': '/assets/tp10-aicon.png', 'nurl': '/assets/tp10-icon.png' }
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
            'ftpval': '',
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
                    "c": [116.40605294,39.91343848], 
                    "d": 165159332, 
                    "name": "Beijing"
                }
            }
        }],
        'otype': 'e',
        'areaselect': false,
        'ctrsets': {
            'useLocalExtrema': false,
            'opacity': 0.5,
            'radius': 1
        },
        'lstnum': 1, // 页面在本次操作之前存在的标签个数(包括额外overlay图层)
        'lstindex': 0, // 存储上次操作的页面标签
        'tda': false,
        'cda': false
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
            max: 4,
            interval: 0.005,
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
        'cimgs': {
            'bj': { 'aurl': '/assets/bj-aicon.png', 'nurl': '/assets/bj-icon.png' },
            'tj': { 'aurl': '/assets/tj-aicon.png', 'nurl': '/assets/tj-icon.png' },
            'zjk': { 'aurl': '/assets/zjk-aicon.png', 'nurl': '/assets/zjk-icon.png' },
            'ts': { 'aurl': '/assets/ts-aicon.png', 'nurl': '/assets/ts-icon.png' }
        }
    }
};

let comp = {
    'params': {
        /**
         * region object
         */
        'regions': [
            { 'name': 'Beijing', 'val': 'bj', 'aurl': '/assets/bj-aicon.png', 'nurl': '/assets/bj-icon.png' },
            { 'name': 'Tianjin', 'val': 'tj', 'aurl': '/assets/tj-aicon.png', 'nurl': '/assets/tj-icon.png' },
            { 'name': 'Zhangjiakou', 'val': 'zjk', 'aurl': '/assets/zjk-aicon.png', 'nurl': '/assets/zjk-icon.png' },
            { 'name': 'Tangshan', 'val': 'ts', 'aurl': '/assets/ts-aicon.png', 'nurl': '/assets/ts-icon.png' }
        ],
        /**
         * entropy types
         */
        'etypes': [
            { 'name': 'Vibrancy', 'val': 'pp' },
            { 'name': 'Mobility', 'val': 'pd' },
            { 'name': 'Variation', 'val': 'rp' },
            { 'name': 'Fluidity', 'val': 'rd' }
        ],
        /**
         * display types
         */
        'dtypes': [
            { 'name': 'Entropy', 'val': 'e' },
            { 'name': 'Mixture', 'val': 'm' },
            { 'name': 'Density', 'val': 'd' }
        ],
        'otypes': [
            { 'name': 'NULL', 'val': -1 },
            { 'name': 'Ttoal GDP', 'val': 0 },
            { 'name': 'Ave GDP', 'val': 3 },
            { 'name': 'Population', 'val': 1 },
            { 'name': 'House Price', 'val': 4 }
        ],
        /**
         * timeblock filters object
         */
        'tpfilters': [
            { 'name': 'Morning', 'val': '0', 'aurl': '/assets/tp0-aicon.png', 'nurl': '/assets/tp0-icon.png' },
            { 'name': 'Forenoon', 'val': '1', 'aurl': '/assets/tp1-aicon.png', 'nurl': '/assets/tp1-icon.png' },
            { 'name': 'Noon', 'val': '2', 'aurl': '/assets/tp2-aicon.png', 'nurl': '/assets/tp2-icon.png' },
            { 'name': 'Afternoon', 'val': '3', 'aurl': '/assets/tp3-aicon.png', 'nurl': '/assets/tp3-icon.png' },
            { 'name': 'Evening', 'val': '4', 'aurl': '/assets/tp4-aicon.png', 'nurl': '/assets/tp4-icon.png' },
            { 'name': 'Night', 'val': '5', 'aurl': '/assets/tp5-aicon.png', 'nurl': '/assets/tp5-icon.png' },
            { 'name': 'Weekday', 'val': '7', 'aurl': '/assets/tp7-aicon.png', 'nurl': '/assets/tp7-icon.png' },
            { 'name': 'Weekend', 'val': '8', 'aurl': '/assets/tp8-aicon.png', 'nurl': '/assets/tp8-icon.png' }
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
            'city': 'tj',
            'etype': 'pp',
            'dtype': 'm',
            'otype': -1,
            'maprev': false,
            'ftpval': '',
            'scales': {
                'e': 1,
                'd': 100
            },
            'id': {
                'card': 'card0',
                'map': 'map0',
                'tab': 'tab0'
            }
        }],
        'ctrmap': false,
        'ctrsets': {
            'multiColorSchema': true,
            'useLocalExtrema': false
        },
        'splitmap': false,
        'lstnum': 1,
        'lstindex': 0,
        'card': true
    },
    'components': {
        'eSlider': {
            width: "auto",
            tooltip: 'hover',
            value: [0, 100],
            disabled: false,
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
        'dSlider': {
            width: "auto",
            tooltip: 'hover',
            value: [0, 100],
            disabled: false,
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
            'pd': 'Mobility',
            'rp': 'Variation',
            'rd': 'Fluidity'
        },
        'dtypes': {
            'e': 'Entropy',
            'm': 'Mixture',
            'd': 'Density'
        },
        'cimgs': {
            'bj': { 'aurl': '/assets/bj-aicon.png', 'nurl': '/assets/bj-icon.png' },
            'tj': { 'aurl': '/assets/tj-aicon.png', 'nurl': '/assets/tj-icon.png' },
            'zjk': { 'aurl': '/assets/zjk-aicon.png', 'nurl': '/assets/zjk-icon.png' },
            'ts': { 'aurl': '/assets/ts-aicon.png', 'nurl': '/assets/ts-icon.png' }
        }
    }
};

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

let stats = {
    /**
     * [TotalGDP, Population, Area, AveGDP, HousePrice]
     */
    'bj': {
        "东城区": [1857.8, 90.5, 42, 205282, 64670],
        "西城区": [3270.40, 129.80, 51, 251957, 78831],
        "丰台区": [1169.9, 232.4, 306, 50340, 35245],
        "海淀区": [4613.50, 369.4, 431, 124892, 53347],
        "石景山区": [430.2, 65.2, 84, 65982, 32827],
        "门头沟区": [144.5, 30.8, 1451, 46916, 22077],
        "顺义区": [1440.9, 102.0, 1020, 141265, 22821],
        "通州区": [594.5, 137.8, 906, 43142, 24825],
        "朝阳区": [4640.2, 395.5, 455, 117325, 44608],
        "大兴区": [1591.6, 156.2, 1026, 101895, 25370],
        "昌平区": [657.3, 196.3, 1344, 33484, 21831],
        "平谷区": [196.2, 42.3, 950, 46383, 13965],
        "怀柔区": [234.2, 38.4, 2123, 60990, 19665],
        "延庆区": [107.35, 31.4, 1994, 34188, 16754],
        "房山区": [554.7, 104.6, 1990, 53031, 15784],
        "密云区": [226.7, 47.9, 2229, 47328, 15475]
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

let smecGen = {
    'bj': {

    },
    'tj': {

    },
    'ts': {

    },
    'zjk': {

    }
}

export {
    regionRecords,
    home,
    comp,
    stats,
    smecMax
}

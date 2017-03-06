/**
 * init.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-03-05 16:10:49
 * @version $Id$
 */

'use strict'

const settings = {
    'whiteToRed': '-webkit-gradient(linear, 0 0, 100% 0, from(white), to(red))'
}

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
            { 'name': 'Value', 'val': 'rp' },
            { 'name': 'Casualty', 'val': 'rd' }
        ],
        /**
         * display types
         */
        'dtypes': [
            { 'name': 'Entropy', 'val': 'e' },
            { 'name': 'Mixture', 'val': 'm' },
            { 'name': 'Density', 'val': 'd' }
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
            { 'name': 'Weekend', 'val': '7', 'aurl': '/assets/tp7-aicon.png', 'nurl': '/assets/tp7-icon.png' },
            { 'name': 'Workday', 'val': '8', 'aurl': '/assets/tp8-aicon.png', 'nurl': '/assets/tp8-icon.png' }
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
            'dtype': 'e',
            'maprev': false,
            'ftpval': '',
            'scales': {
                'e': 1,
                'd': 100
            },
            'id': {
                'card': 'card0',
                'map': 'map0',
                'panel': 'tab0'
            }
        }],
        'ctrmap': false,
        'ctrsets': {
            'multiColorSchema': true,
            'useLocalExtrema': false
        },
        'splitmap': false,
        'num': 1,
        'lstindex': -999
    },
    'components': {
        'eSlider': {
            tooltip: 'hover',
            value: [0, 100],
            tooltipStyle: {
                "backgroundColor": "#000",
                "borderColor": "#f00"
            },
            bgStyle: {
                'background': settings['whiteToRed']
            },
            processStyle: {
                'background': settings['whiteToRed']
            }
        },
        'dSlider': {
            tooltip: 'hover',
            value: [0, 100],
            tooltipStyle: {
                "backgroundColor": "#000",
                "borderColor": "#f00"
            },
            bgStyle: {
                'background': settings['whiteToRed']
            },
            processStyle: {
                'background': settings['whiteToRed']
            }
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

export {
    regionRecords,
    comp
}

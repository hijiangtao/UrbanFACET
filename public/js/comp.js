/**
 * comp.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-02-12 16:21:47
 * @version $Id$
 */

'use strict'

import Vue from 'vue'
import mapview from './components/xmap-view'
import analysistools from './components/analysistools' 
import $ from "jquery"
window.jQuery = $
import {regionRecords} from './components/initdata'

let mapins = new mapview('map'),
    anains = new analysistools('', 'clamatrixheatmap')

let userpanel = new Vue({
	el: '#userpanel',
    data: {
    	'params': {
    		'regions': [
    			{ 'name': 'Beijing', 'val': 'bj' },
	            { 'name': 'Tianjin', 'val': 'tj' },
	            { 'name': 'Zhangjiakou', 'val': 'zjk' },
	            { 'name': 'Tangshan', 'val': 'ts' }
    		]
    	}
    },
    methods: {
    	'getEntropyOverview': function(city) {
    		if (city !== 'bj') {
				let prop = {
				    'minVal': 0,
				    'maxVal': 1.79
				}
    			mapins.panTo( regionRecords[city]['center'] )
    			getEntropy(city, 'poi').then(function(res) {
    				alert('OK')
				  	mapins.mapgridDrawing(res, prop)
				}).catch(function(err) {
				  	console.error("Failed!", err);
				});
    		}
    	},
    	'regionImgUrl': function(city) {
    		return `/assets/${city}-icon.png`
    	}
    }
    // computed: {
    	
    // },
    // watch: {

    // },
    // mounted: {
    	
    // }
})

let getEntropy = function(city, type) {
	let p = new Promise(function(resolve, reject) {
		$.get(`/comp/overviewQuery?city=${city}&type=${type}`, function(res, err) {
			if (res['scode']) {
				resolve(res['data'])
			} else {
				reject(err)
			}
		})
	})

	return p
}
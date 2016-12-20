/**
 * /index.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2016-12-07 15:28:52
 * @version $Id$
 */

'use strict'

import Vue from 'vue'
import mapview from './components/mapview'
import $ from "jquery"
window.jQuery = $
require('../../semantic/dist/components/accordion')

import { genNumArr } from './components/lib'

/**
 * LMap instance: hold map view instance and its' related operating approaches
 * @type {LMap}
 */
let mapins = new mapview('map')

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
            { 'name': 'Education related', 'value': 'edu' },
            { 'name': 'Employee related', 'value': 'empl' },
            { 'name': 'Tourists related', 'value': 'tour' },
            { 'name': 'Healthcare related', 'value': 'heal' },
            { 'name': 'Students related', 'value': 'stu' },
            { 'name': 'Finicial related', 'value': 'fini' }
        ],
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
        ]
    },
    'selections': {
        'regionVal': 'Select Region',
        'featureName': 'Select Feature',
        'featureVal': 0,
        'decompName': 'Decompose Method',
        'themeName': 'Select Theme',
        'themeVal': '',
        'tmodelVal': [],
        'vctimeName': 'Select query time',
        'vcdaytypeVal': '',
        'vctimeperiodVal': '',
        'dbscanminptsName': 'Selection MinPts',
        'dbscaneps': '0'
    },
    'states': {
        'tsnetrain': false,
        'clsutertrain': false,
        'vcquery': false
    },
    'results': {
        'peoplegroups': []
    }
}

// index page vue instance
let userpanel = new Vue({
    el: '#userpanel',
    data: vuedata,
    methods: {
        changeRegion(val) {
            this.selections.regionVal = val
        },
        changeFeature(name, val) {
            this.selections.featureName = name
            this.selections.featureVal = val
        },
        changeTheme(name, val) {
            this.selections.themeName = name
            this.selections.themeVal = val
            this.selections.tmodelVal = this.settings.tmodels[val]
        },
        changevcTime(dayname, tpname, dayval, tpval) {
            this.selections.vctimeName = `${dayname} - ${tpname}`
            this.selections.vcdaytypeVal = dayval
            this.selections.vctimeperiodVal = tpval
        },
        changeDBScanInp(val) {
            this.selections.dbscanminptsName = val
        },
        tsneTrain() {
            let self = this, regionVal = this.selections.regionVal, featureVal = this.selections.featureVal

            if (regionVal !== 'Select Region' && featureVal !== 0) {
                self.states.tsnetrain = true
                $.get(`/home/v1/tsnetrain?region=${this.selections.regionVal}&feature=${this.selections.featureVal}&srate=3`, function(res, err) {
                    if (res['scode']) {
                        alert('success');
                        self.states.tsnetrain = false
                    } else {
                        alert('server error')
                    }
                })
            } else {
                alert('Both region and feature rule should be selected before the t-SNE program runs!');
            }
            
        },
        clusterTrain() {
            this.states.clsutertrain = true
            let self = this, minpts = this.selections.dbscanminptsName, eps = this.selections.dbscaneps

            if (minpts !== '' && eps !== '') {
                
            } else {
                
            }
        },
        vcQuery() {
            this.states.vcquery = true
        },
    },
    mounted: function () {
      this.$nextTick(function () {
        $('.ui.accordion').accordion();
      })
      console.log('The vue isntance has mounted.')

      mapins.map.invalidateSize()
    }
})

// remove loading effect
document.addEventListener("DOMContentLoaded", function(event) { 
  document.getElementsByTagName('body')[0].classList.remove('loading');
});
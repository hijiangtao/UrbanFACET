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
            { 'name': 'Weekday Daytime', 'value': 5 },
            { 'name': 'Weekend Evening', 'value': 6 }
        ],
        'decomps': [
            { 'name': 't-SNE', 'value': 1 },
            { 'name': 'PCA', 'value': 2 },
            { 'name': 'MDS', 'value': 3 }, 
        ],
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
        }
    },
    'selections': {
        'regionVal': 'Select Region',
        'featureName': 'Select Feature',
        'featureVal': 0,
        'decompName': 'Decompose Method',
        'themeName': 'Select Theme',
        'themeVal': '',
        'tmodelVal': []
    },
    'timebtngroup': [
        { 'text': 'morning' },
        { 'text': 'forenoon' },
        { 'text': 'noon' },
        { 'text': 'afternoon' },
        { 'text': 'evening' },
        { 'text': 'night' }
    ],
    useridstring: '',
    poibtngroup: [
        { 'label': 'Food' },
        { 'label': 'Clothes' },
        { 'label': 'Residence' },
        { 'label': 'Transport' },
        { 'label': 'Finance' },
        { 'label': 'Education' },
        { 'label': 'Other' }
    ]
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
        changeTheme(val) {
            this.selections.themeVal = val
            this.selections.tmodelVal = this.settings.tmodels[val]
        },
        tsneTrain() {

        },
        queryuser(event) {
            let self = this
            $.get(`/users/api/v1/ui/q?id=${self.useridstring}&type=all`, function(res, err) {
                mapins.pointmapDrawing(res, ["beijing"]);
            })
        }
    },
    mounted: function () {
      this.$nextTick(function () {
        $('.ui.accordion').accordion();
      })
      console.log('The vue isntance has mounted.')

      mapins.map.invalidateSize()
    }
})

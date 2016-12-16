/**
 * /index.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2016-12-07 15:28:52
 * @version $Id$
 */

'use strict'

import $ from "jquery"
import Vue from 'vue'
import LMap from './components/mapview'

/**
 * LMap instance: hold map view instance and its' related operating approaches
 * @type {LMap}
 */
let mapins = new LMap()

let vuedata = {
    timebtngroup: [
        { 'text': 'morning' },
        { 'text': 'forenoon' },
        { 'text': 'noon' },
        { 'text': 'afternoon' },
        { 'text': 'evening' },
        { 'text': 'night' }
    ],
    modebtngroup: [
        { 'label': 'Edit' }, 
        { 'label': 'Observe' }
    ],
    regionbtngroup: [
        { 'label': 'Beijing' },
        { 'label': 'Tianjin' },
        { 'label': 'Zhangjiakou' },
        { 'label': 'Tangshan' }
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
        queryuser(event) {
            let self = this
            $.get(`/users/api/v1/ui/q?id=${self.useridstring}&type=all`, function(res, err) {
                mapins.pointmapDrawing(res, ["beijing"]);
            })
        }
    }
})

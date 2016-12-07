/**
 * 
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2016-12-07 15:28:52
 * @version $Id$
 */

'use strict'
import $ from "jquery"
import Vue from 'vue'
import VueRouter from 'vue-router'
import LMap from './components/map'

let mapins = new LMap()
let userpanel = new Vue({
    el: '#userpanel',
    data: {
        timebtngroup: [{
            'text': 'morning'
        },{
            'text': 'forenoon'
        },{
            'text': 'noon'
        },{
            'text': 'afternoon'
        },{
            'text': 'evening'
        },{
            'text': 'night'
        }],
        timebtngroupcla: {
            'tiny': true,
            'secondary': true,
            'hollow': true,
            'button': true
        },
        modebtngroup: [{
            'label': 'Edit'
        },{
            'label': 'Observe'
        }],
        modebtngroupprop: {
            'name': 'mode'
        },
        useridstring: ''
    },
    methods: {
        test() {

        },
        queryuser(event) {
            let self = this
            $.get(`/users/api/v1/ui/q?id=${self.useridstring}&type=all`, function(res, err) {
                mapins.pointmapDrawing(res, ["beijing"]);
            })
        }
    }
})
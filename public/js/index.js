/**
 * /index.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2016-12-07 15:28:52
 * @version $Id$
 */

'use strict'

import Vue from 'vue'
import mapview from './components/mapview'
import analysistools from './components/analysistools' 
import $ from "jquery"
window.jQuery = $
require('../../semantic/dist/components/accordion')

import { vuedata } from './components/initdata'

/**
 * LMap instance: hold map view instance and its' related operating approaches
 * @type {LMap}
 */
let mapins = new mapview('map'),
    anains = new analysistools('', 'clamatrixheatmap')


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
            // console.log(name, val)
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
        changeThemeParam(name, val) {
            // console.log(name, val)
            this.selections.modelParamName = name
            this.selections.modelParamVal = val
        },
        changeSelectCla(val) {
            this.selections.vcclaName = val

            if (val === 'ALL') {
                alert('ATTENTION: the matrix will not updated.')
            } else {
                anains.drawMatrix(this.results.classmatrix[val], 'clamatrixheatmap', 'FeatureMatrix', {
                    height:'87%',
                    y:'13%',
                    left:'0%',
                    right:'0%'
                })
            }
        },
        tsneTrain() {
            let self = this, regionVal = this.selections.regionVal, featureVal = this.selections.featureVal, id = this.states.userid

            if (regionVal !== 'Select Region' && featureVal !== 0) {
                self.states.tsnetrain = true
                $.get(`/home/v1/tsnetrain?region=${this.selections.regionVal}&feature=${this.selections.featureVal}&srate=3&id=${id}`, function(res, err) {
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
            let self = this, minpts = this.selections.dbscanminptsName, eps = this.selections.dbscaneps, theme = this.selections.themeName, regionVal = this.selections.regionVal, featureVal = this.selections.featureVal, id = this.states.userid

            if (minpts !== '' && eps !== '') {
                this.states.clustertrain = true

                let data = {
                    'eps': eps,
                    'minpts': minpts,
                    'pkg': JSON.stringify(self.selections.tmodelVal),
                    'region': regionVal,
                    'feature': featureVal,
                    'srate': 3,
                    'id': id
                }

                $.post(`/home/v1/clustertrain`, data, function(res, err) {
                    if (res['scode'] === 1) {
                        self.states.clustertrain = false

                        self.states.themesdisplay = true
                        self.states.clustertrain = false
                        self.results.clafilename = res['clafilename']

                        if (self.states.userid !== res['id']) {
                            self.states.userid = res['id']
                        }
                        console.log('clustering work complete')
                    } else {
                        alert('cluster work failed, please try again later')
                    }
                })
            } else {
                alert('all fields must be input.')
            }
        },
        labelTrain() {
            let self = this, theme = this.selections.themeVal, paramval = this.selections.modelParamVal, rangeval = this.selections.modelParamRangeVal, id = this.states.userid

            $.get(`/home/v1/labeltrain?theme=${theme}&paramval=${paramval}&rangeval=${rangeval}&id=${id}`, function(res, err) {
                if (res['scode'] === 1) {
                    self.results.classlist = res['clalist']
                    self.results.classmatrix = res['matrixlist']

                    self.settings.classes = res['clalist']
                    self.settings.classes.push('ALL')

                } else {
                    alert('server error, please try again later.')
                }
            })
        },
        vcQuery() {
            let self = this, daytype = this.selections.vcdaytypeVal, timeperiod = this.selections.vctimeperiodVal, cla = this.selections.vcclaName, clafilename = this.results.clafilename

            if (daytype !== '' && timeperiod !== '' && cla !== '') {
                self.states.vcquery = true
                // judge if class is ALL type
                if (cla === 'ALL') {
                    cla = self.results.classlist
                } else {
                    cla = [cla]
                }

                let data = {
                    'daytype': daytype,
                    'timeperiod': timeperiod,
                    'cla': cla,
                    'clafilename': clafilename
                }
                $.post(`/home/v1/vcquery`, data, function(res, err) {
                    if (res['scode'] === 1) {
                        self.states.vcquery = false
                    } else {
                        alert('server error.')
                    }
                })
            } else {
                alert('All fields should be filled.')
            }

            
        },
    },
    computed: {
        labelbtndisplay: function() {
            return this.selections.tmodelVal !== '' && this.selections.modelParamVal !== ''
        }
    },
    watch: {

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
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
import * as d3 from 'd3'
require('../../semantic/dist/components/accordion')
require('../../semantic/dist/components/modal')
require('../../semantic/dist/components/dimmer')
require('../../semantic/dist/components/transition')

import {indexvuedata} from './components/initdata'

/**
 * LMap instance: hold map view instance and its' related operating approaches
 * @type {LMap}
 */
let mapins = new mapview('map'),
    anains = new analysistools('', 'clamatrixheatmap')


let featureTypes = ['workday', 'weekend', 'daytime', 'evening', 'wodaytime', 'weevening']

// index page vue instance
let userpanel = new Vue({
    el: '#userpanel',
    data: indexvuedata,
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
            // this.selections.tmodelVal = this.settings.tmodels[val]
        },
        changevcTime(dayname, tpname, dayval, tpval) {
            this.selections.vctimeName = `${dayname} - ${tpname}`
            this.selections.vcdaytypeVal = dayval
            this.selections.vctimeperiodVal = tpval
        },
        changecompvcTime(dayname, tpname, dayval, tpval) {
            this.selections.compvctimeName = `${dayname} - ${tpname}`
            this.selections.compvcdaytypeVal = dayval
            this.selections.compvctimeperiodVal = tpval
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
        },
        showDecomposeImg() {
            if (this.results.decomposeimgurl !== '') {
                window.open(this.results.decomposeimgurl, '_blank');    
            }
        },
        changeSelectCompCla(val) {
            this.selections.compvcclaName = val
        },
        usageguidanceShow() {
            $('.ui.fullscreen.modal').modal('show')
        },
        tsneTrain() {
            let self = this, 
                regionVal = this.selections.regionVal, 
                featureVal = this.selections.featureVal, 
                id = this.states.userid,
                srate = this.selections.samplerateVal

            if (regionVal !== 'Select Region' && featureVal !== 0) {
                self.states.tsnetrain = true
                $.get(`/home/v1/tsnetrain?region=${this.selections.regionVal}&feature=${this.selections.featureVal}&srate=${srate}&id=${id}`, function(res, err) {
                    if (res['scode']) {
                        alert('success');
                        self.states.tsnetrain = false
                        self.states.clusterdisplay = true
                        self.results.decomposeimgurl = `/img/decompose/2D-ScatterData_1-in-${srate}_tsne-${featureTypes[featureVal-1]}(byRecNum).png`
                    } else {
                        alert('server error')
                    }
                })
            } else {
                alert('Both region and feature rule should be selected before the t-SNE program runs!');
            }          
        },
        clusterTrain() {
            let self = this, 
                minpts = this.selections.dbscanminptsName, 
                eps = this.selections.dbscaneps, 
                theme = this.selections.themeName, 
                regionVal = this.selections.regionVal, 
                featureVal = this.selections.featureVal, 
                id = this.states.userid,
                srate = this.selections.samplerateVal

            if (minpts !== '' && eps !== '') {
                this.states.clustertrain = true

                let data = {
                    'eps': eps,
                    'minpts': minpts,
                    'pkg': JSON.stringify(self.selections.tmodelVal),
                    'region': regionVal,
                    'feature': featureVal,
                    'srate': srate,
                    'id': id
                }

                $.post(`/home/v1/clustertrain`, data, function(res, err) {
                    if (res['scode'] === 1) {
                        self.states.clustertrain = false

                        self.states.themesdisplay = true
                        self.states.clustertrain = false
                        self.states.anadisplay = true
                        self.results.clafilename = res['clafilename']

                        if (self.states.userid !== res['id']) {
                            self.states.userid = res['id']
                        }
                        console.log('clustering work complete')
                        alert('success');

                        // self.results.decomposeimgurl = `/img/cluster/DBScanCluster-1-in-${srate}_tsne-${featureTypes[featureVal-1]}(eps=${eps},minpts=${minpts}).png`
                        self.results.decomposeimgurl = ''
                        self.classplot()

                        document.getElementById('accordionanatitle').click()
                    } else {
                        alert('cluster work failed, please try again later')
                    }
                })
            } else {
                alert('all fields must be input.')
            }
        },
        labelTrain() {
            let self = this, 
                theme = this.selections.themeVal, 
                paramval = this.selections.modelParamVal, 
                rangeval = this.selections.modelParamRangeVal, 
                id = this.states.userid
            
            if (theme !== '' && paramval !== '' && id !== '-1') {
                self.states.labeltrain = true
                $.get(`/home/v1/labeltrain?theme=${theme}&paramval=${paramval}&rangeval=${rangeval}&id=${id}`, function(res, err) {
                    self.states.labeltrain = false
                    if (res['scode'] === 1) {

                        self.results.classlist = res['clalist']
                        self.results.classmatrix = res['matrixlist']

                        self.settings.classes = res['clalist']
                        self.settings.classes.push('ALL')
                        alert('success');
                    } else {
                        alert('server error, please try again later.')
                    }
                })
            } else {
                alert('All fields should be filled.')
            }
        },
        vcQuery() {
            let self = this, 
                daytype = this.selections.vcdaytypeVal, 
                timeperiod = this.selections.vctimeperiodVal, 
                cla = this.selections.vcclaName, 
                compdaytype = this.selections.compvcdaytypeVal,
                comptimeperiod = this.selections.compvctimeperiodVal,
                compcla = this.selections.compvcclaName,
                clafilename = this.results.clafilename,
                qmode = this.selections.vcqmodeVal

            if (daytype !== '' && timeperiod !== '' && cla !== 'Select Class' && clafilename !== '') {
                if (qmode === 1 && compcla === '') {
                    alert('All fields should be filled.')
                    return ;
                }

                if (qmode === 2 && (comptimeperiod === '' || compdaytype === '')) {
                    alert('All fields should be filled.')
                    return ;
                }

                self.states.vcquery = true
                document.getElementsByTagName('body')[0].classList.add('loading');
                // judge if class is ALL type
                if (cla === 'ALL') {
                    cla = self.results.classlist
                } else {
                    cla = [cla]
                }

                let data = {
                    'qmode': qmode,
                    'daytype': daytype,
                    'timeperiod': timeperiod,
                    'cla': cla,
                    'compdaytype': compdaytype,
                    'comptimeperiod': comptimeperiod,
                    'compcla': compcla,
                    'clafilename': clafilename
                }
                $.post(`/home/v1/vcquery`, data, function(res, err) {
                    if (res['scode'] === 1) {
                        self.states.vcquery = false
                        document.getElementsByTagName('body')[0].classList.remove('loading');

                        mapins.pointmapDrawing(res['data'], res['group'])
                        console.log('Color map', res['group'])
                    } else {
                        alert('server error.')
                    }
                })
            } else {
                alert('All fields should be filled.')
            }
        },
        classplot() {
            let self = this,
                minpts = this.selections.dbscanminptsName, 
                eps = this.selections.dbscaneps, 
                srate = this.selections.samplerateVal,
                feature = this.selections.featureVal,
                id = this.states.userid

            $.get(`/home/v1/test/classplot?feature=${feature}&srate=${srate}&eps=${eps}&minpts=${minpts}&id=${id}`, function(res, err) {
                if (res['scode'] === 1) {
                    // remove class btn disabled effect
                    document.getElementById('vcclaDropdown').classList.remove('disabled')
                    let compClaDropdown = document.getElementById('compvcclaDropdown')
                    if (compClaDropdown) {
                        compClaDropdown.classList.remove('disabled')
                    }

                    let clalen = res['clalist'].length
                    self.results['classlist'] = res['clalist'].slice(1, clalen)
                    self.results['classmatrix'] = res['matrixlist']
                    self.results['userpoints'] = res['data']

                    self.settings.classes = res['clalist'].slice(1, clalen)
                    self.settings.classes.push('ALL')   

                    mapins.scatterplotDrawing(res['data'], res['clalist'], 'clascatterplot', self)
                } else {
                    alert('server error.')
                }
            })
        },
        claExpandDisplay() {
            let self = this,
                clalist = self.results['classlist'],
                data = self.results['userpoints']

            $('.ui.small.modal').modal('show')  
            mapins.scatterplotDrawing(data, clalist, 'expclascatterplot', self)
        }
    },
    computed: {
        labelbtndisplay: function() {
            return this.selections.themeVal !== '' && this.selections.modelParamVal !== '' && this.states.themesdisplay
        }
    },
    watch: {
        'selections.vcqmodeVal': function(val) {
            this.$nextTick(function () {
               if (this.settings.classes.length !== 0) {
                    document.getElementById('vcclaDropdown').classList.remove('disabled')
                    let compClaDropdown = document.getElementById('compvcclaDropdown')
                    if (compClaDropdown) {
                        compClaDropdown.classList.remove('disabled')
                    }
                }

                if (val !== 1) {
                    document.getElementById('compclamatrixheatmap').innerHTML = ''
                }
            }) 
        },
        'selections.vcclaName': function(val) {
            this.$nextTick(function() {
                if (val === 'ALL') {
                    alert('ATTENTION: the matrix will not updated.')
                } else {
                    anains.drawMatrix(this.results.classmatrix[val], 'clamatrixheatmap', `FeatureMatrix Class${val}`, {
                        height:'70%',
                        y:'20%',
                        left:'16%',
                        right:'0%'
                    })
                }
            })
        },
        'selections.compvcclaName': function(val) {
            if (this.selections.vcqmodeVal === 1) {
                this.$nextTick(function() {
                    anains.drawMatrix(this.results.classmatrix[val], 'compclamatrixheatmap', `FeatureMatrix Class${val}`, {
                        height:'70%',
                        y:'20%',
                        left:'16%',
                        right:'0%'
                    })
                })
            }
        }
    },
    mounted: function () {
      this.$nextTick(function () {
        $('.ui.accordion').accordion()
        $('.ui.fullscreen.modal').modal()
        $('.ui.small.modal').modal()
      })
      console.log('The vue isntance has mounted.')

      // mapins.map.invalidateSize()
    }
})

// remove loading effect
document.addEventListener("DOMContentLoaded", function(event) { 
  document.getElementsByTagName('body')[0].classList.remove('loading');
;
});